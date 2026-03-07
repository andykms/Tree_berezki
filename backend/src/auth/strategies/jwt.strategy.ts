import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { IJwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UserService,
  ) {
    const jwtConfig = configService.get('JWT_CONFIG');

    if (!jwtConfig) {
      throw new Error('JWT configuration is not defined');
    }

    const secret = jwtConfig.accessTokenSecret;
    if (!secret) {
      throw new Error('secretToken is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(jwtPayload: { sub: string }) {
    const user = await this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
