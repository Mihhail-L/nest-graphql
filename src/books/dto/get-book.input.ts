import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class GetBookInput {
  @Field(() => [Int], { nullable: true })
  id?: number[];

  @Field(() => [Int], { nullable: true })
  author?: number[];
}
