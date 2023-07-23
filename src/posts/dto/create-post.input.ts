import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String, { description: 'Title' })
  title: string;

  @Field(() => String, { description: 'Content' })
  content: string;
}
