import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { LocalGuard } from './guards/local.guard';
import { JwtRefreshGuard } from './guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() createAuthDto: CreateAuthDto,
    @Req() req,
    @Res() res,
    @Ip() ip,
  ) {
    const user = await this.usersService.create(createAuthDto);
    const userAgent = req.headers['user-agent'];
    const tokens = await this.authService.auth(user, res, ip, userAgent);
    res.json(tokens);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req, @Res() res, @Ip() ip) {
    const userAgent = req.headers['user-agent'];
    const tokens = await this.authService.auth(req.user, res, ip, userAgent);
    res.json(tokens);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    await this.authService.verifyAllTokens(req.user);
    return await this.authService.refresh(req.user);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    await this.authService.logout(req.refreshToken, req.user, res);
    res.json({
      message: 'ok',
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logoutAll')
  async logoutAll(@Req() req, @Res() res) {
    await this.authService.logoutAll(req.user, res);
    return res.json({
      message: 'ok',
    });
  }
}
