import { UpdatePostInput } from '../dto/update-post.input';
import { PostEntity } from '../entities/post.entity';

export default function (
  input: UpdatePostInput,
  oldPost: PostEntity,
): PostEntity {
  oldPost.title = input.title;
  oldPost.content = input.content;

  return oldPost;
}
