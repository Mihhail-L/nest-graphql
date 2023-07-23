import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import createUserObject from './commands/createUserObject';
import validateUniqueUser from './commands/validateUniqueUser';
import updateUserObject from './commands/updateUserObject';
import { RegisterUserInput } from './dto/register-user.input';
import { GetUsersInput } from './dto/get-users.input';
import getUsers from './commands/getUsers';
import { UserDeleteResult } from '../common/graphql/commonTypes/deleteResult';
import { UserStatus } from '../common/graphql/enums/userEnums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(input: CreateUserInput | RegisterUserInput): Promise<User> {
    const user = await createUserObject(input);
    await validateUniqueUser(input.email, this.userRepository);

    try {
      await this.userRepository.insert(user);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(`Failed to create user`);
    }

    return user;
  }

  async insertOrUpdateUser(user: User): Promise<User> {
    try {
      await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(`Failed to create user`);
    }

    return user;
  }

  async findAll(input?: GetUsersInput): Promise<User[]> {
    return await getUsers(this.userRepository, input);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: String(email).trim() },
    });
  }

  async findOne(id: string, withDeleted = false): Promise<User> {
    const queryBuilder = this.userRepository.createQueryBuilder();
    queryBuilder.andWhere({ id: id });

    if (!withDeleted) {
      queryBuilder.andWhere('deletedAt IS NULL');
    }

    try {
      return await queryBuilder.getOneOrFail();
    } catch (e) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const userId = input.id ? input.id : id;
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    const updatedUser = await updateUserObject(user, input);
    updatedUser.updatedAt = new Date();

    try {
      await this.userRepository.save(updatedUser);
    } catch (e) {
      console.log(e);
      throw new GraphQLError(`Failed to update user: ${e.sqlMessage}`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<UserDeleteResult> {
    let user: User | null = null;
    try {
      user = await this.findOne(id);
      await this.userRepository.save({
        id,
        status: UserStatus.INACTIVE,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (e) {
      throw e;
    }

    return {
      status: true,
      user,
    };
  }
}
