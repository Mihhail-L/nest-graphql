import { registerEnumType } from '@nestjs/graphql';

export enum Roles {
  ADMIN = 'admin',
  SUBSCRIBED = 'subscribed',
  REGISTERED = 'registered',
}

export enum UserStatus {
  EMAIL_NOT_VERIFIED = 'not_verified',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

registerEnumType(Roles, {
  name: 'Roles',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
});
