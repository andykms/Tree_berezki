import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IConfig } from '../../config/app.config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<IConfig>,
  ) {}

  sign(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('refreshTokenSecret', { infer: true }),
      expiresIn: this.configService.get('refreshTokenExpiresIn', {
        infer: true,
      }),
    });
  }

  verify(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get('refreshTokenSecret', { infer: true }),
    });
  }
}
