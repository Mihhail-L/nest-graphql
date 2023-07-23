import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonResult {
  constructor(status = false, message = '') {
    this.status = status;
    this.message = message;
  }

  @Field(() => Boolean)
  status: boolean;

  @Field(() => String, { nullable: true })
  message?: string | null;
}
