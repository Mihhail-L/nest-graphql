import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { GqlAuthGuard } from '../auth/gqlAuth.guard';
import {
  AccessGuard,
  CaslUser,
  DefaultActions,
  UseAbility,
  UserProxy,
} from 'nest-casl';
import { UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { PostDeleteResult } from '../common/graphql/commonTypes/deleteResult';

@Resolver(() => PostEntity)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => PostEntity)
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.create, PostEntity)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @CaslUser() userProxy: UserProxy<User>,
  ): Promise<PostEntity> {
    const user = await userProxy.get();
    return await this.postsService.create(createPostInput, user);
  }

  @Query(() => [PostEntity], { name: 'posts' })
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.read, PostEntity)
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Query(() => PostEntity, { name: 'post' })
  @UseGuards(GqlAuthGuard, AccessGuard)
  @UseAbility(DefaultActions.read, PostEntity)
  findOne(@Args('id', { type: () => Int }) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Mutation(() => PostEntity)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('input') updatePostInput: UpdatePostInput,
    @CaslUser() userProxy: UserProxy<User>,
  ): Promise<PostEntity> {
    const user = await userProxy.get();
    return this.postsService.update(updatePostInput, user);
  }

  @Mutation(() => PostEntity)
  @UseGuards(GqlAuthGuard)
  async removePost(
    @Args('id', { type: () => Int }) id: number,
    @CaslUser() userProxy: UserProxy<User>,
  ): Promise<PostDeleteResult> {
    const user = await userProxy.get();

    return this.postsService.remove(id, user);
  }
}
