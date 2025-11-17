import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ShopModule } from './shop/shop.module';
import { BasketModule } from './basket/basket.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { configuration, type IConfig } from './config/app.config';
import { CookieExtractorService } from './cookie-extractor/cookie-extractor.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [configuration.KEY],
      useFactory: (config: IConfig) => ({
        secret: config.accessTokenSecret,
        signOptions: { expiresIn: config.accessTokenExpiresIn },
      }),
    }),
    UserModule,
    AccountModule,
    CommentModule,
    ReplyModule,
    OrderModule,
    ProductModule,
    CategoryModule,
    ShopModule,
    BasketModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CookieExtractorService],
})
export class AppModule {}
