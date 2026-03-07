import { Module, OnApplicationBootstrap } from '@nestjs/common';
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
import { jwtConfig } from './config/jwt.config';
import { SeedsModule } from './database/seeds/seeds.module';
import { MeasureSeeder } from './database/seeds/measure.seeder';
import { CategorySeeder } from './database/seeds/category.seeder';
import { UploadModule } from './upload/upload.module';
import { FileMoveModule } from './file-move/file-move.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ShowcaseProductsModule } from './showcase-products/showcase-products.module';
import { ParamModule } from './param/param.module';
import { MeasureModule } from './measure/measure.module';

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

        const expiresIn = configService.get<string>(
          'JWT_CONFIG.accessTokenExpiresIn',
        );

        if (!secret || !expiresIn) {
          throw new Error('JWT_CONFIG is not defined');
        }

        return {
          secret,
        };
      },
    }),
    ScheduleModule.forRoot(),
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
    SeedsModule,
    UploadModule,
    FileMoveModule,
    ShowcaseProductsModule,
    ParamModule,
    MeasureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly measureSeeder: MeasureSeeder,
    private readonly categorySeeder: CategorySeeder,
  ) {}

  async onApplicationBootstrap() {
    // Запускаем сидинг только в development режиме
    if (process.env.NODE_ENV !== 'production') {
      await this.measureSeeder.seed();
      await this.categorySeeder.seed();
    }
  }
}
