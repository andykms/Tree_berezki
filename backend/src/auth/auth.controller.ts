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
import { RefreshGuard } from './guards/refreshToken.guard';

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
    //console.log("USER", user);
    const userAgent = req.headers['user-agent'];
    //console.log("USER AGENT", userAgent);
    //console.log("IP", ip);
    const tokens = await this.authService.auth(user, res, ip, userAgent);
    return res.json(tokens);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Req() req, @Res() res, @Ip() ip) {
    const userAgent = req.headers['user-agent'];
    return await this.authService.auth(req.user, res, ip, userAgent);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    await this.authService.verifyAllTokens(req.user);
    return await this.authService.refresh(req.user);
  }

  @UseGuards(RefreshGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    await this.authService.logout(req.refreshToken, req.user, res);
    return {
      message: 'ok',
    };
  }

  @UseGuards(RefreshGuard)
  @Post('logoutAll')
  async logoutAll(@Req() req, @Res() res) {
    await this.authService.logoutAll(req.user, res);
    return {
      message: 'ok',
    };
  }
}
