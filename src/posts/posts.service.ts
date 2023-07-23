import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import createNewPostObject from './commands/createNewPostObject';
import { GraphQLError } from 'graphql';
import { PostDeleteResult } from '../common/graphql/commonTypes/deleteResult';
import { User } from '../users/entities/user.entity';
import { Roles } from '../common/graphql/enums/userEnums';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}
  async create(
    createPostInput: CreatePostInput,
    user: User,
  ): Promise<PostEntity> {
    const post = createNewPostObject(createPostInput, user);

    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<PostEntity[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<PostEntity> {
    return await this.postsRepository
      .find({
        where: {
          id: id,
        },
        relations: {
          author: true,
        },
      })
      .then((posts) => {
        if (posts.length === 0) {
          throw new NotFoundException('Post not found');
        }

        return posts[0];
      });
  }

  async update(
    updatePostInput: UpdatePostInput,
    user: User,
  ): Promise<PostEntity> {
    const post = await this.postsRepository.findOneBy({
      id: updatePostInput.id,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // todo: move to casl and or rework permissions/roles
    if (!user.roles?.includes(Roles.ADMIN) && post.author.id !== user.id) {
      throw new UnauthorizedException();
    }

    post.title = updatePostInput.title;
    post.content = updatePostInput.content;

    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new GraphQLError('Error saving post');
    }

    return post;
  }

  async remove(id: number, user: User): Promise<PostDeleteResult> {
    const post = await this.postsRepository.findOneBy({ id: id });

    if (!post) {
      return {
        post: null,
        status: false,
      };
    }

    if (!user.roles?.includes(Roles.ADMIN) && post.author.id !== user.id) {
      throw new UnauthorizedException();
    }

    try {
      post.deletedAt = new Date();
      await this.postsRepository.save(post);
    } catch (error) {
      throw new GraphQLError('Error deleting post');
    }

    return {
      post: post,
      status: true,
    };
  }
}
