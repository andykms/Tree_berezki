import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './entities/account.entity';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [TypeOrmModule.forFeature([Account])],
})
export class AccountModule {}
