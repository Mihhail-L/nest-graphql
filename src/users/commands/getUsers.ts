import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { GetUsersInput } from '../dto/get-users.input';
import { GraphQLError } from 'graphql';

const getUsers = async (
  repository: Repository<User>,
  input?: GetUsersInput,
): Promise<User[]> => {
  const query = repository.createQueryBuilder('user');

  if (input) {
    if (input.id) {
      query.andWhere('user.id = :id', { id: input.id });
    }

    if (input.search) {
      query.andWhere(
        'user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search',
        { search: `%${input.search}%` },
      );
    }

    if (input.deleted) {
      query.andWhere('user.deleted = :deleted', { deleted: input.deleted });
    }
  }

  try {
    return await query.getMany();
  } catch (e) {
    console.log(e);
    throw new GraphQLError(`Failed to get users`);
  }
};

export default getUsers;
