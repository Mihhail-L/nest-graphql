import { PostEntity } from '../entities/post.entity';
import { CreatePostInput } from '../dto/create-post.input';
import { User } from '../../users/entities/user.entity';

export default function (input: CreatePostInput, user: User): PostEntity {
  const post = new PostEntity();
  post.title = input.title;
  post.content = input.content;
  post.author = user;

  return post;
}
