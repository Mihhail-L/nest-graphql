import { InputType, Field } from '@nestjs/graphql';
import { UserStatus, Roles } from '../../common/graphql/enums/userEnums';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'First name' })
  firstName: string;

  @Field(() => String, { description: 'Last name' })
  lastName: string;

  @Field(() => String, { description: 'Email' })
  email: string;

  @Field(() => String, { description: 'Password' })
  password: string;

  @Field(() => [Roles], { description: 'Role', nullable: true })
  roles?: Roles[];

  @Field(() => String, { description: 'Status', nullable: true })
  status?: UserStatus;
}
