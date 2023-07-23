import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUsersInput {
  @Field(() => [Number], { description: 'Search by id(s)', nullable: true })
  id?: string[];

  @Field(() => Boolean, {
    description: 'Search by deleted status',
    nullable: true,
  })
  deleted?: boolean;

  @Field(() => String, { description: 'Search by text', nullable: true })
  search?: string;
}
