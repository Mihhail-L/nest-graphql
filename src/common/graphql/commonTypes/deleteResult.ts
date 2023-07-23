import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../../users/entities/user.entity';
import { PostEntity } from '../../../posts/entities/post.entity';

@ObjectType()
export class DeleteResult {
  @Field(() => Boolean)
  status: boolean;
}

@ObjectType()
export class UserDeleteResult extends DeleteResult {
  @Field(() => User, { nullable: true })
  user: User | null;
}

@ObjectType()
export class PostDeleteResult extends DeleteResult {
  @Field(() => PostEntity, { nullable: true })
  post: PostEntity | null;
}
