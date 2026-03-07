import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtShopGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;
      const userShops = user.shops.map((shop) => shop.id);
      if (
        userShops.includes(request.params?.shopId) ||
        userShops.includes(request.body?.shopId)
      ) {
        return true;
      }
      throw new UnauthorizedException('недостаточно прав');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
