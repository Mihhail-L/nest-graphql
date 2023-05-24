import { AuthorsResolver } from '../../src/authors/authors.resolver';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../../src/authors/authors.service';
import { BooksService } from '../../src/books/books.service';
import { BooksResolver } from '../../src/books/books.resolver';
import { AppModule } from '../../src/app.module';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../src/authors/entities/author.entity';
import { Book } from '../../src/books/entities/book.entity';
import databaseCleanupHelper from '../helpers/databaseCleanupHelper';

describe('BooksResolver', () => {
  let resolver: BooksResolver;
  let database: DataSource;
  let bookId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorsResolver, AuthorsService, BooksService, BooksResolver],
      imports: [AppModule, TypeOrmModule.forFeature([Author, Book])],
    }).compile();

    resolver = module.get<BooksResolver>(BooksResolver);
    database = module.get(getDataSourceToken('default'));

    await databaseCleanupHelper(database);

    // create author for book testings
    await database
      .createQueryBuilder()
      .insert()
      .into(Author)
      .values({
        firstName: 'John',
        lastName: 'Doe',
      })
      .execute();
  });

  afterAll(async () => {
    await databaseCleanupHelper(database);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should create a book', async () => {
    const book = await resolver.createBook({
      title: 'The Hobbit',
      description: 'There and Back Again',
    });

    bookId = book.id;

    expect(book).toEqual({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
    });
  });

  it('should get all books', async () => {
    const books = await resolver.getBooks();

    expect(books).toEqual([
      {
        id: bookId,
        title: 'The Hobbit',
        description: 'There and Back Again',
        author: null,
      },
    ]);
  });

  it('should find one book', async () => {
    const book = await resolver.getBooks({
      id: [bookId],
    });

    expect(book[0]).toEqual({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
      author: null,
    });
  });

  it('should update a book', async () => {
    const book = await resolver.updateBook({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
      author: 1,
    });

    expect(book).toEqual({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
      author: {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      },
    });
  });

  it('should delete a book', async () => {
    const book = await resolver.removeBook(bookId);

    expect(book.acknowledged).toEqual(true);
  });
});
