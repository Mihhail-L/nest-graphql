import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class GetAuthorInput {
  @Field(() => [Int], { nullable: true })
  id?: number[];

  @Field(() => [Int], { nullable: true })
  book?: number[];
}
