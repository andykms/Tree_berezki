import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(phone: string, password: string) {
    const user = await this.authService.validatePassword(phone, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
