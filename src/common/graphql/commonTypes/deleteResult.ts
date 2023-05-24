import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteResult {
  @Field(() => Boolean)
  acknowledged: boolean;

  @Field(() => Number)
  deletedCount: number;
}
