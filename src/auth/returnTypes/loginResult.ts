import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class LoginResult {
  @Field(() => User)
  user: User;

  @Field(() => String)
  accessToken: string;
}
