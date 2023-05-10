import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;
}
