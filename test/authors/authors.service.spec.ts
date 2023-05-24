import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from '../../src/authors/authors.service';
import { AppModule } from '../../src/app.module';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../src/authors/entities/author.entity';
import { Book } from '../../src/books/entities/book.entity';
import { DataSource } from 'typeorm';
import databaseCleanupHelper from '../helpers/databaseCleanupHelper';
import { NotFoundException } from '@nestjs/common';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let database: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorsService],
      imports: [AppModule, TypeOrmModule.forFeature([Author, Book])],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    database = module.get(getDataSourceToken('default'));
  });

  afterAll(async () => {
    await databaseCleanupHelper(database);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  let authorId: number;
  it('should create an author', async () => {
    const author = await service.create({
      firstName: 'John',
      lastName: 'Doe',
    });

    authorId = author.id;

    expect(author).toStrictEqual({
      id: authorId,
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('should find created author', async () => {
    const author = await service.findOne(authorId);

    expect(author).toEqual({
      id: authorId,
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('Should fail to find author', async () => {
    await expect(service.findAll({ id: [1123123123] })).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should find all authors', async () => {
    const author = await service.findAll();

    expect(author[0]).toEqual({
      id: authorId,
      firstName: 'John',
      lastName: 'Doe',
      books: [],
    });
  });

  it('Should fail to update author', async () => {
    const author = await service.update({
      id: 123123,
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(author.affected).toBe(0);
  });

  it('should update author', async () => {
    const author = await service.update({
      id: authorId,
      firstName: 'John1',
      lastName: 'Doe2',
    });

    expect(author.affected).toBe(1);
  });

  it('should delete author', async () => {
    const author = await service.remove(authorId);

    expect(author.deletedCount).toBe(1);
  });

  it('Should fail to delete author', async () => {
    await expect(service.remove(123123)).rejects.toThrowError(
      NotFoundException,
    );
  });
});
