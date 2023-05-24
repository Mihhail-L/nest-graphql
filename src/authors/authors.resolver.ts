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
import { UpdateResult } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { DeleteResult } from '../common/graphql/commonTypes/deleteResult';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private readonly authorsService: AuthorsService,
    @Inject(BooksService)
    private readonly booksService: BooksService,
  ) {}

  @Mutation(() => Author, {
    name: 'createAuthor',
    description: 'Create a new author',
  })
  createAuthor(
    @Args('input') createAuthorInput: CreateAuthorInput,
  ): Promise<Author> {
    return this.authorsService.create(createAuthorInput);
  }

  @Query(() => [Author], {
    name: 'getAuthors',
    nullable: true,
    description: 'Get authors',
  })
  findAll(
    @Args({
      name: 'input',
      nullable: true,
      type: () => GetAuthorInput,
    })
    getAuthorInput?: GetAuthorInput,
  ): Promise<Author[]> {
    return this.authorsService.findAll(getAuthorInput);
  }

  @Mutation(() => Author, {
    name: 'updateAuthor',
    description: 'Update an author',
  })
  updateAuthor(
    @Args('input') updateAuthorInput: UpdateAuthorInput,
  ): Promise<UpdateResult> {
    return this.authorsService.update(updateAuthorInput);
  }

  @Mutation(() => DeleteResult, {
    name: 'deleteAuthor',
    description: 'Delete an author',
  })
  deleteAuthor(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DeleteResult> {
    return this.authorsService.remove(id);
  }

  @ResolveField()
  books(@Parent() author: Author): Promise<Book[]> {
    return this.booksService.findAllByAuthor(author.id);
  }
}
