import { Injectable } from '@nestjs/common';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mail/mail.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import createUserObject from '../users/commands/createUserObject';
import { GraphQLError } from 'graphql';
import { UserConfirmationToken } from '../common/entities/userConfirmationToken.entity';
import createUserConfirmationToken from './commands/createUserConfirmationToken';
import { UserStatus } from '../common/graphql/enums/userEnums';
import { CommonResult } from '../common/graphql/commonTypes/commonResult';
import createPasswordResetToken from './commands/createPasswordResetToken';
import { PasswordResetToken } from '../common/entities/passwordResetToken.entity';
import { ResetPasswordInput } from './dto/resetPassword.input';
import {
  comparePassword,
  createUserPasswordHash,
} from '../users/commands/userPasswordHelpers';
import { ValidateUserInput } from '../users/commands/valiateUserInput';
import { LoginResult } from './returnTypes/loginResult';
import { LoginInput } from './dto/login.input';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserConfirmationToken)
    private readonly userConfirmationTokenRepository: Repository<UserConfirmationToken>,
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async register(input: RegisterUserInput): Promise<User> {
    const user = await createUserObject(input);
    let token: UserConfirmationToken;

    // TODO: implement transaction instead of two try/catch blocks
    try {
      await this.usersService.insertOrUpdateUser(user);
      token = await createUserConfirmationToken(
        user,
        this.userConfirmationTokenRepository,
      );
    } catch (e) {
      console.log(e);
      throw new GraphQLError(`Failed to register user, try again later`);
    }

    try {
      await this.mailService.sendConfirmationToken(user, token.token);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(
        `User was registered, but failed to send confirmation email, please try resending confirmation email`,
      );
    }

    return user;
  }

  async resendConfirmationToken(email: string): Promise<CommonResult> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user || user.status === UserStatus.ACTIVE) {
      return {
        status: false,
        message: `User not found or already confirmed`,
      };
    }

    const checkExistingToken =
      await this.userConfirmationTokenRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
      });

    if (checkExistingToken) {
      try {
        await this.userConfirmationTokenRepository.delete({
          id: checkExistingToken.id,
        });
      } catch (e) {
        console.log(e);
        throw new GraphQLError(
          `Failed to resend confirmation email, try again later`,
        );
      }
    }

    const token = await createUserConfirmationToken(
      user,
      this.userConfirmationTokenRepository,
    );

    try {
      await this.mailService.sendConfirmationToken(user, token.token);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(
        `Failed to send confirmation email, try again later`,
      );
    }

    return {
      status: true,
      message: `Confirmation email sent`,
    };
  }

  async confirmUser(token: string): Promise<CommonResult> {
    const confirmationToken =
      await this.userConfirmationTokenRepository.findOne({
        where: {
          token: token,
        },
        relations: {
          user: true,
        },
      });

    if (!confirmationToken || !confirmationToken.user) {
      return {
        status: false,
        message: 'Something went wrong, try again later.',
      };
    }

    const { user } = confirmationToken;

    user.status = UserStatus.ACTIVE;
    await this.usersService.insertOrUpdateUser(user);

    await this.userConfirmationTokenRepository.delete({
      id: confirmationToken.id,
    });

    return {
      status: true,
      message: `User confirmed`,
    };
  }

  async forgotPassword(email: string): Promise<CommonResult> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      return {
        status: true,
        message:
          'If an account with that email exists, a reset token has been sent',
      };
    }

    try {
      const token = await createPasswordResetToken(
        user,
        this.passwordResetTokenRepository,
      );

      await this.mailService.sendPasswordResetToken(user, token.token);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(
        `Failed to send forgot password email, try again later`,
      );
    }

    return {
      status: true,
      message: `Forgot password email sent`,
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<CommonResult> {
    const validator = new ValidateUserInput();

    validator.validateUserPassword(input.password);

    const token = await this.passwordResetTokenRepository.findOne({
      where: {
        token: input.token,
      },
      relations: {
        user: true,
      },
    });

    if (!token || !token.user) {
      return {
        status: false,
        message: `Invalid token`,
      };
    }

    if (input.password !== input.passwordConfirmation) {
      return {
        status: false,
        message: `Passwords don't match`,
      };
    }

    const { user } = token;
    user.password = await createUserPasswordHash(input.password);

    try {
      await this.usersService.insertOrUpdateUser(user);
      await this.passwordResetTokenRepository.delete({
        id: token.id,
      });
    } catch (e) {
      console.log(e);
      throw new GraphQLError(`Failed to reset password, try again later`);
    }

    return {
      status: true,
      message: `Password reset`,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (passwordMatch) {
      return user;
    }

    return null;
  }

  async login(input: LoginInput): Promise<LoginResult> {
    const { email, password } = input;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new GraphQLError(`Invalid email or password`);
    }

    const token: string = this.jwtService.sign({
      username: user.email,
      sub: user.id,
      roles: user.roles,
    });

    return {
      user: user,
      accessToken: token,
    };
  }
}
