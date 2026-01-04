import { ConfigType, registerAs } from '@nestjs/config';
import type { StringValue } from 'ms';

export const jwtConfig = registerAs('JWT_CONFIG', () => ({
  refreshTokenSecret:
    process.env.REFRESH_SECRET_TOKEN ||
    '09g35g$*(HF*($#!@3ngg5iUbiub&#&*GT#&@T',
  accessTokenSecret:
    process.env.ACCESS_SECRET_TOKEN || '08gn90ngs90j340gjsponbo',
  refreshTokenExpiresIn: (process.env.REFRESH_SECRET_EXPIRES_IN ||
    '7d') as StringValue,
  accessTokenExpiresIn: (process.env.ACCESS_SECRET_EXPIRES_IN ||
    '1h') as StringValue,
}));

export type IJwtConfig = ConfigType<typeof jwtConfig>;
