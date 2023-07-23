import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  token: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  passwordConfirmation: string;
}
