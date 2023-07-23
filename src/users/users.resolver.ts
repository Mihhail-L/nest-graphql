import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserDeleteResult } from '../common/graphql/commonTypes/deleteResult';
import { GetUsersInput } from './dto/get-users.input';
import { GqlAuthGuard } from '../auth/gqlAuth.guard';
import { UseGuards } from '@nestjs/common';
import {
  AccessGuard,
  AccessService,
  CaslConditions,
  CaslUser,
  ConditionsProxy,
  DefaultActions,
  UseAbility,
  UserProxy,
} from 'nest-casl';
import { UserHook } from './user.hook';
import { Roles } from '../common/graphql/enums/userEnums';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private accessService: AccessService,
  ) {}

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.create, User)
  createUser(@Args('input') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getUsers' })
  getUsers(
    @Args('input', { nullable: true }) getUsersInput?: GetUsersInput,
  ): Promise<User[]> {
    return this.usersService.findAll(getUsersInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.update, User, UserHook)
  async updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CaslUser() userProxy: UserProxy<User>,
  ): Promise<User> {
    const user = await userProxy.get();
    if (user.roles.includes(Roles.ADMIN)) {
      return this.usersService.update(updateUserInput.id, updateUserInput);
    }
    return this.usersService.update(user.id, updateUserInput);
  }

  @Mutation(() => UserDeleteResult)
  deleteUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserDeleteResult> {
    return this.usersService.delete(id);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.read, User)
  async whoAmI(@CaslUser() userProxy: UserProxy<User>): Promise<User> {
    const user = await userProxy.get();
    return this.usersService.findOne(user.id);
  }
}
