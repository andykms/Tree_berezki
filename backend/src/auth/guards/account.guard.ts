import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor() {}
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user as User;
      const accounts = user.accounts.map((account) => account.id);
      if (
        accounts.includes(request.body.accountId) ||
        accounts.includes(request.params.id)
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
