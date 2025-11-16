import { constants } from 'http2';
import type IError from './type-error';

export default class UnauthorizedError extends Error implements IError {
  public statusCode = constants.HTTP_STATUS_UNAUTHORIZED;

  constructor(message?: string) {
    super(message || 'не авторизован');
  }
}
