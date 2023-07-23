import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { AuthService } from './auth.service';
import { CommonResult } from '../common/graphql/commonTypes/commonResult';
import { ResetPasswordInput } from './dto/resetPassword.input';
import { LoginInput } from './dto/login.input';
import { LoginResult } from './returnTypes/loginResult';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => User)
  register(@Args('input') registerUserInput: RegisterUserInput): Promise<User> {
    return this.authService.register(registerUserInput);
  }

  @Mutation(() => CommonResult)
  confirmUser(@Args('token') token: string): Promise<CommonResult> {
    return this.authService.confirmUser(token);
  }

  @Mutation(() => CommonResult)
  resendConfirmationToken(@Args('email') email: string): Promise<CommonResult> {
    return this.authService.resendConfirmationToken(email);
  }

  @Mutation(() => CommonResult)
  forgotPassword(@Args('email') email: string): Promise<CommonResult> {
    return this.authService.forgotPassword(email);
  }

  @Mutation(() => CommonResult)
  resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<CommonResult> {
    return this.authService.resetPassword(input);
  }

  @Mutation(() => LoginResult)
  login(@Args('input') input: LoginInput): Promise<LoginResult> {
    return this.authService.login(input);
  }
}
