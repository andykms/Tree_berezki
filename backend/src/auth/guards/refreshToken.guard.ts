import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { UserService } from '../../user/user.service';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromCookie(request) ||
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromBody(request);

    const unauthMessage = 'refresh токен не валиден';

    if (!token) {
      throw new UnauthorizedException(unauthMessage);
    }

    try {
      const payload = this.refreshTokenService.verify(token);

      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException(unauthMessage);
      }

      if (
        !user.sessions.some((session) => session.refreshToken === payload.sub)
      ) {
        throw new UnauthorizedException(unauthMessage);
      }

      request.user = user;
      request.refreshToken = token;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(unauthMessage);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Refresh' ? token : undefined;
  }

  private extractTokenFromBody(request: Request): string | undefined {
    return request.body?.refreshToken;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    // Для Express.js
    return request.cookies?.refreshToken;
  }
}
