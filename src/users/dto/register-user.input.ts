import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
  @Field(() => String, { description: 'First name' })
  firstName: string;

  @Field(() => String, { description: 'Last name' })
  lastName: string;

  @Field(() => String, { description: 'Email' })
  email: string;

  @Field(() => String, { description: 'Password' })
  password: string;
}
