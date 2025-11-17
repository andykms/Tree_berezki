import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ISessionInfo, User } from '../user/entities/user.entity';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';
import { type IConfig } from '../config/app.config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshService: RefreshTokenService,
    private readonly configService: ConfigService<IConfig>
  ) {}

  async auth(user: User, res: Response, ipAddress: string, userAgent: string) {
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.refreshService.sign(payload);

    const sessionInfo = {
      refreshToken,
      ipAddress,
      userAgent,
      createdAt: new Date()
    };

    await this.usersService.update(user.id, {
      sessions: [...user.sessions, sessionInfo]
    });

    res.cookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: this.configService.get("refreshTokenExpiresIn")
    })

    return {
      accessToken,
      refreshToken
    };
  }

  async validatePassword(phone: string, password: string): Promise<User|null> {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      return null;
    }
    const hash = await bcrypt.hash(user.password);
    const matched = await bcrypt.compare(password, hash);
    if (matched) {
      return user;
    }
    return null;
  }

  async refresh(user: User) {
    const payload = {sub: user.id};
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken
    }
  }

  async logout(oldRefreshToken: string, user: User, res: Response): Promise<void> {
    await this.usersService.update(user.id, {
      sessions: user.sessions.filter(session => session.refreshToken !== oldRefreshToken)
    })
    res.clearCookie("refreshToken");
  }

  async verifyAllTokens(user: User) {
    const verifiedSessions: ISessionInfo[] = [];
    let isUpdated = false;
    for(const session of user.sessions) {
      try {
        const payload = this.jwtService.verify(session.refreshToken);
        if(payload.sub == user.id) verifiedSessions.push(session);
        else isUpdated = true;
      } catch(error) {
        isUpdated = true;
      }
    }

    if(isUpdated) {
      await this.usersService.update(user.id, {
        sessions: verifiedSessions
      })
    }
  }

  async logoutAll(user: User, res: Response): Promise<void> {
    await this.usersService.update(user.id, {
      sessions: []
    })
    res.clearCookie("refreshToken");
  }
}
