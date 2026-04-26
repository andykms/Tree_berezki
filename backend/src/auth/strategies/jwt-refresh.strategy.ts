import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { type IJwtConfig, jwtConfig } from '../../config/jwt.config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly configService: IJwtConfig,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.refreshTokenSecret,
    });
  }

  async validate(jwtPayload: { sub: string }) {
    const user = await this.usersService.findOne(jwtPayload.sub, ["sessions"]);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
