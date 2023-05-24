import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../src/authors/entities/author.entity';
import { Book } from '../../src/books/entities/book.entity';
import databaseCleanupHelper from '../helpers/databaseCleanupHelper';
import { BooksService } from '../../src/books/books.service';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let database: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
      imports: [AppModule, TypeOrmModule.forFeature([Author, Book])],
    }).compile();

    service = module.get<BooksService>(BooksService);
    database = module.get(getDataSourceToken('default'));

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
    expect(service).toBeDefined();
  });

  let bookId: number;
  it('should create a book', async () => {
    const book = await service.create({
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

  it('should find created book', async () => {
    const book = await service.findOne(bookId);

    expect(book).toEqual({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
      author: null,
    });
  });

  it('Should fail to find book', async () => {
    await expect(service.findAll({ id: [1123123123] })).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should update a book', async () => {
    const book = await service.update({
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

  it('should fail to delete book', async () => {
    await expect(service.remove(1123123123)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should find all books', async () => {
    const books = await service.findAll();

    expect(books[0]).toEqual({
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

  it('should find all books with author', async () => {
    const books = await service.findAllByAuthor(1);

    expect(books[0]).toEqual({
      id: bookId,
      title: 'The Hobbit',
      description: 'There and Back Again',
    });
  });

  it('should fail to update book', async () => {
    await expect(
      service.update({
        id: 1123123123,
        title: 'The Hobbit',
        description: 'There and Back Again',
      }),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should delete a book', async () => {
    const book = await service.remove(bookId);

    expect(book.acknowledged).toEqual(true);
  });
});
