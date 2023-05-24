import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MYSQL_DATABASE,
  MYSQL_HOST,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USERNAME,
  NODE_ENV,
} from './util/envConfig';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { DataSource } from 'typeorm';
import { GraphQLError } from 'graphql';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      username: MYSQL_USERNAME,
      password: MYSQL_PASSWORD,
      database: MYSQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: any = {
          message: error.message,
          originalError: error.extensions?.originalError,
        };

        return graphQLFormattedError;
      },
      introspection: NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BooksModule,
    AuthorsModule,
  ],
  exports: [AppModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
