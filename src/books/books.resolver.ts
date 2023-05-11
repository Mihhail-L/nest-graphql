import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Author } from '../authors/entities/author.entity';
import { AuthorsService } from '../authors/authors.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GetBookInput } from './dto/get-book.input';
import { DeleteResult } from 'typeorm';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(Author)
    private readonly authorsService: AuthorsService,
  ) {}

  @Mutation(() => Book)
  createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
  ): Promise<Book> {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'getBooks' })
  findAll(
    @Args({
      name: 'getBookInput',
      type: () => GetBookInput,
      nullable: true,
    })
    getBookInput?: GetBookInput,
  ): Promise<Book[]> {
    return this.booksService.findAll(getBookInput);
  }

  @Mutation(() => Book)
  updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
  ): Promise<Book> {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DeleteResult> {
    return this.booksService.remove(id);
  }
}
