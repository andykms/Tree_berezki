import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtConfig } from '../../config/jwt.config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sign(payload: any) {
    return await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_CONFIG').refreshTokenSecret,
      expiresIn: this.configService.get('JWT_CONFIG').refreshTokenExpiresIn,
    });
  }

  async verify(token: string) {
    return await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_CONFIG').refreshTokenSecret,
    });
  }
}
