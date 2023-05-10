import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Author } from '../../authors/entities/author.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  @Field(() => Int)
  id: number;

  @Column('varchar', { length: 255 })
  @Field(() => String)
  title: string;

  @Column('text', { nullable: true })
  @Field(() => String)
  description: string | null;

  @ManyToOne(() => Author, (author) => author.books)
  @Field(() => Author, { nullable: true })
  author?: Author;
}
