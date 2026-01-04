import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ShopModule } from './shop/shop.module';
import { BasketModule } from './basket/basket.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { configuration } from './config/app.config';
import { QuestionModule } from './question/question.module';
import { DatabaseModule } from './database/database.module';
import { dbConfiguration } from './config/db.config';
import { jwtConfig, IJwtConfig } from './config/jwt.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, dbConfiguration, jwtConfig],
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get('JWT_CONFIG.accessTokenSecret');

        const expiresIn = configService.get<string>('JWT_CONFIG.accessTokenExpiresIn');

        if(!secret || !expiresIn) {
          throw new Error('JWT_CONFIG is not defined');
        }

        return {
          secret
        }
      }
    }),
    DatabaseModule,
    UserModule,
    AccountModule,
    CommentModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    ShopModule,
    BasketModule,
    AuthModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
