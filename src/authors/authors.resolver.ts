import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { BooksService } from '../books/books.service';
import { Inject } from '@nestjs/common';
import { GetAuthorInput } from './dto/get-author.input';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Book } from '../books/entities/book.entity';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    @Inject(BooksService)
    private readonly booksService: BooksService,
  ) {}

  @Mutation(() => Author)
  createAuthor(
    @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return this.authorsService.create(createAuthorInput);
  }

  @Query(() => [Author], { name: 'getAuthors' })
  findAll(
    @Args({
      name: 'getAuthorInput',
      nullable: true,
      type: () => GetAuthorInput,
    })
    getAuthorInput: GetAuthorInput,
  ): Promise<Author[]> {
    return this.authorsService.findAll(getAuthorInput);
  }

  @Query(() => Author, { name: 'author' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Author> {
    return this.authorsService.findOne(id);
  }

  @Mutation(() => Author)
  updateAuthor(
    @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput,
  ): Promise<UpdateResult> {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author)
  removeAuthor(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DeleteResult> {
    return this.authorsService.remove(id);
  }

  @ResolveField()
  books(@Parent() author: Author): Promise<Book[]> {
    return this.booksService.findAllByAuthor(author.id);
  }
}
