import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsResolver } from '../../src/authors/authors.resolver';
import { AuthorsService } from '../../src/authors/authors.service';
import { BooksService } from '../../src/books/books.service';
import { BooksResolver } from '../../src/books/books.resolver';
import { AppModule } from '../../src/app.module';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../src/authors/entities/author.entity';
import { Book } from '../../src/books/entities/book.entity';
import { DataSource } from 'typeorm';
import databaseCleanupHelper from '../helpers/databaseCleanupHelper';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsResolver', () => {
  let resolver: AuthorsResolver;
  let database: DataSource;
  let authorId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorsResolver, AuthorsService, BooksService, BooksResolver],
      imports: [AppModule, TypeOrmModule.forFeature([Author, Book])],
    }).compile();

    resolver = module.get<AuthorsResolver>(AuthorsResolver);
    database = module.get(getDataSourceToken('default'));

    await databaseCleanupHelper(database);
  });

  afterAll(async () => {
    await databaseCleanupHelper(database);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('db should be defined', () => {
    expect(database).toBeDefined();
  });

  it('should create an author', async () => {
    const author = await resolver.createAuthor({
      firstName: 'John',
      lastName: 'Doe',
    });

    authorId = author.id;

    expect(author).toBeDefined();
    expect(author.id).toBeDefined();
    expect(author.firstName).toBe('John');
    expect(author.lastName).toBe('Doe');
  });

  it('Should resolve books', async () => {
    const author = await resolver.findAll({ id: [authorId] });
    const book = await resolver.books(author[0]);

    expect(book).toBeDefined();
    expect(book.length).toBe(0);
  });

  it('should get all authors', async () => {
    const authors = await resolver.findAll();

    expect(authors).toBeDefined();
    expect(authors.length).toBe(1);
  });

  it('should fail to get author by book id', async () => {
    const authors = resolver.findAll({ book: [1] });

    await expect(authors).rejects.toThrowError(NotFoundException);
  });

  it('should update an author', async () => {
    const author = await resolver.updateAuthor({
      id: authorId,
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(author).toBeDefined();
    expect(author.affected).toBe(1);
  });

  it('should delete an author', async () => {
    const author = await resolver.deleteAuthor(authorId);

    expect(author).toBeDefined();
    expect(author.deletedCount).toBe(1);
  });
});
