import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET } from '../../common/util/envConfig';
import { UsersService } from '../../users/users.service';
import { Roles } from '../../common/graphql/enums/userEnums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<AggregatedUser> {
    return {
      id: Number(payload.sub),
      email: String(payload.username),
      roles: payload.roles,
    };
  }
}

export interface AggregatedUser {
  id: number;
  email: string;
  roles: [Roles];
}
