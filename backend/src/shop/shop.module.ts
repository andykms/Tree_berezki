import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { ProductModule } from '../product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';

@Module({
  controllers: [ShopController],
  providers: [ShopService, JwtStrategy],
  imports: [
    UserModule,
    JwtModule,
    ProductModule,
    TypeOrmModule.forFeature([Shop]),
  ],
  exports: [ShopService],
})
export class ShopModule {}
