import { User } from '../../users/entities/user.entity';
import { GraphQLError } from 'graphql/index';
import { UserConfirmationToken } from '../../common/entities/userConfirmationToken.entity';
import { Repository } from 'typeorm';

const createUserConfirmationToken = async (
  user: User,
  userConfirmationTokenRepository: Repository<UserConfirmationToken>,
): Promise<UserConfirmationToken> => {
  const tokenEntity: UserConfirmationToken = new UserConfirmationToken();
  tokenEntity.user = user;

  try {
    await userConfirmationTokenRepository.insert(tokenEntity);
  } catch (e) {
    console.log(e);
    throw new GraphQLError(`Failed to register user, try again later`);
  }

  return tokenEntity;
};

export default createUserConfirmationToken;
