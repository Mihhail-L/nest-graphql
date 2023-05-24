import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { GetBookInput } from './dto/get-book.input';
import { DeleteResult } from '../common/graphql/commonTypes/deleteResult';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Mutation(() => Book)
  createBook(@Args('input') createBookInput: CreateBookInput): Promise<Book> {
    return this.booksService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'getBooks' })
  getBooks(
    @Args({
      name: 'input',
      type: () => GetBookInput,
      nullable: true,
    })
    getBookInput?: GetBookInput,
  ): Promise<Book[]> {
    return this.booksService.findAll(getBookInput);
  }

  @Mutation(() => Book)
  updateBook(@Args('input') updateBookInput: UpdateBookInput): Promise<Book> {
    return this.booksService.update(updateBookInput);
  }

  @Mutation(() => Book)
  removeBook(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DeleteResult> {
    return this.booksService.remove(id);
  }
}
