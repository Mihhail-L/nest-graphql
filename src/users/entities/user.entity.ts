import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles, UserStatus } from '../../common/graphql/enums/userEnums';
import { AuthorizableUser } from 'nest-casl';
import { Post } from '@nestjs/common';
import { PostEntity } from '../../posts/entities/post.entity';

@ObjectType()
@Entity()
export class User implements AuthorizableUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: string;

  @Field(() => String)
  @Column('varchar', { name: 'firstName', length: 255 })
  firstName: string;

  @Field(() => String)
  @Column('varchar', { name: 'lastName', length: 255 })
  lastName: string;

  @Field(() => String)
  @Column('varchar', { name: 'email', length: 255, unique: true })
  email: string;

  @Column('text', { name: 'password' })
  password: string;

  @Field(() => [Roles])
  @Column('simple-array', {
    name: 'roles',
  })
  roles: Roles[];

  @Field(() => String)
  @Column('varchar', {
    name: 'status',
    default: UserStatus.EMAIL_NOT_VERIFIED,
    length: 255,
  })
  status: UserStatus;

  @Field(() => Date)
  @Column('datetime', { name: 'createdAt', default: () => 'NOW' })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Column('datetime', { name: 'updatedAt', nullable: true, default: null })
  updatedAt: Date | null;

  @Field(() => Date, { nullable: true })
  @Column('datetime', { name: 'deletedAt', nullable: true, default: null })
  deletedAt: Date | null;

  @Field(() => [PostEntity])
  @OneToMany(() => PostEntity, (post) => post.author, {
    cascade: ['remove'],
  })
  posts: PostEntity[];
}
