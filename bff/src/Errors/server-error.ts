import { constants } from 'http2';
import type IError from './type-error';

export default class InternalServerError extends Error implements IError {
  public statusCode: number;

  constructor(message?: string) {
    super(message || 'ошибка обработки запроса');
    this.statusCode = constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}
