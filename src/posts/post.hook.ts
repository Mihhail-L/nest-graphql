import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { PostEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostHook implements SubjectBeforeFilterHook<PostEntity, Request> {
  constructor(private readonly postsService: PostsService) {}

  async run({ params }: Request): Promise<PostEntity> {
    return await this.postsService.findOne(params.input.id);
  }
}
