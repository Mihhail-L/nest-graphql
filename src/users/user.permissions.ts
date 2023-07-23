import { DefaultActions, InferSubjects, Permissions } from 'nest-casl';
import { User } from './entities/user.entity';
import { Roles } from '../common/graphql/enums/userEnums';

export type Subjects = InferSubjects<typeof User>;

export const permissions: Permissions<Roles, Subjects> = {
  everyone({ can }) {
    can(DefaultActions.read, User);
  },
  [Roles.REGISTERED]({ user, can }) {
    can(DefaultActions.update, User, { id: user.id });
  },
};
