import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { PasswordResetToken } from '../../common/entities/passwordResetToken.entity';
import * as crypto from 'crypto';

const createPasswordResetToken = async (
  user: User,
  repository: Repository<PasswordResetToken>,
): Promise<PasswordResetToken> => {
  let token: string;
  let canContinue = false;

  const existingToken: PasswordResetToken = await repository.findOne({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  if (existingToken) {
    await repository.delete(existingToken.id);
  }

  while (!canContinue) {
    token = crypto.randomBytes(32).toString('hex');
    const tokenEntity = await repository.findOne({
      where: {
        token: token,
      },
    });

    if (!tokenEntity) {
      canContinue = true;
    }
  }

  const tokenEntity: PasswordResetToken = new PasswordResetToken();
  tokenEntity.user = user;

  try {
    await repository.insert(tokenEntity);
  } catch (e) {
    console.log(e);
    throw new Error(`Failed to create password reset token, try again later`);
  }

  return tokenEntity;
};

export default createPasswordResetToken;
