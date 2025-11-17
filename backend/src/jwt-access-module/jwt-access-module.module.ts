import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IConfig } from '../config/app.config';

@Module({})
export class JwtAccessModuleModule {
  static register(configuration): DynamicModule {
    return JwtModule.registerAsync({
      global: true,
      inject: [configuration.KEY],
      useFactory: (config: IConfig) => ({
        secret: config.accessTokenSecret,
        signOptions: { expiresIn: config.accessTokenExpiresIn },
      }),
    });
  }
}
