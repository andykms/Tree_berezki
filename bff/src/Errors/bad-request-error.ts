import { constants } from 'http2';
import type IError from './type-error';

export default class BadRequestError extends Error implements IError {
  public statusCode: number;

  constructor(message?: string) {
    super(message || 'данные не валидны');
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}
