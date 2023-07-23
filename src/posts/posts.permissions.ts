import { DefaultActions, InferSubjects, Permissions } from 'nest-casl';
import { Roles } from '../common/graphql/enums/userEnums';
import { PostEntity } from './entities/post.entity';

export type Subjects = InferSubjects<typeof PostEntity>;

export const permissions: Permissions<Roles, Subjects, DefaultActions> = {
  everyone({ can }) {
    can(DefaultActions.read, PostEntity);
  },
  [Roles.REGISTERED]({ user, can }) {
    can(DefaultActions.create, PostEntity);
    can(DefaultActions.update, PostEntity, {
      author: {
        id: user.id,
      },
    });
    can(DefaultActions.delete, PostEntity, {
      author: {
        id: user.id,
      },
    });
  },
};
