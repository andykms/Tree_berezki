import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AccountGuard } from '../auth/guards/account.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createAccountDto: CreateAccountDto, @Req() req) {
    return await this.accountService.create(createAccountDto, req.user);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.accountService.findOne(id);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountService.update(id, updateAccountDto);
  }

  @UseGuards(JwtGuard, AccountGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.accountService.remove(id);
  }
}
