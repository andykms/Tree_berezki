import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
/* 
HttpInterceptor - интерфейс, который должен реализовывать класс,
чтобы перехватывать HTTP-запросы/ответы.

HttpRequest - тип HTTP-запроса

HttpHandler - обработчик, который передаст запрос дальше по цепочке.
HttpErrorResponse - класс для обработки HTTP-ошибок.
HttpEvent - тип HTTP-события (запрос или ответ, ошибка).
*/
import { Router } from '@angular/router';

//Импортируем роутер, чтобы в случае ошибки перенаправить пользователя на страницу логина

import { catchError, switchMap, filter, take } from 'rxjs/operators';

/**
 * catchError - оператор RxJS для перехвата ошибок в потоке.
 * switchMap - оператор RxJS для преобразования значений из одного потока в другой.
 * filter - фильтрация значений в потоке.
 * take - оператор RxJS для выбора какого-либо значения из потока.
 */
import { throwError, Observable, BehaviorSubject } from 'rxjs';

/**
 * throwError - создает Observable, который выбрасывает ошибку.
 * Observable - класс RxJS для создания асинхронных потоков данных.
 * BehaviorSubject - класс RxJS для создания наблюдаемого значения.
 */
import { Injectable } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  //флаг для определения, идет ли сейчас обновление токена.
  //Это предотвращает множенство запросов на обновление токена.
  private isRefreshing = false;

  /**
   * BehaviorSubject - класс RxJS для создания наблюдаемого значения.
   * Хранит последнее значение и позволяет подписаться на изменения.
   * При подписке сразу отдает последнее значение.
   * Позволяет подписаться на изменения и получить последнее значение.
   * 
   * Здесь он используется как очередь для ожидающих запросов на обновление токена.
   */
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router) {}


  /**
   * req - текущий HTTP-запрос
   * next - следующий обработчик в цепочке
   * (Почти все как в Express)
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Получаем токен из сервиса AuthService
    const accessToken = this.authService.getAccessToken();
    //Если токен есть, присоединяем его к запросу 
    // в заголовок Authorization с типом Bearer
    // Это позволяет удобно добавлять Interceptor в приложение
    // и не писать все время добавление токена в каждый запрос.
    if (accessToken) {
      // Добавляем токен в заголовок

      // Так как HttpRequest - это не изменяемый объект (иммутабельный объект), 
      // его нужно клонировать
      req = req.clone({
        setHeaders: { 
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // Обрабатываем запрос
    return next.handle(req).pipe(
      //catchError - оператор RxJS для перехвата ошибок в потоке.
      catchError((error) => {
        // Если получен ответ с кодом 401, обрабатываем ошибку
        // То есть это означает, что скорее всего токен просрочился и нужно 
        // его обновить при помощи refreshToken
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }

        // Если ошибка не 401, пробрасываем ее дальше
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Проверяем, что токен не обновляется в данный момент
    if (!this.isRefreshing) {
      // Устанавливаем флаг, что токен обновляется
      // (Если вспомнить Linux API POSIX, то это аналог fork(), где первый запрос пойдет в родительский процесс,а остальные процессы должны дождаться ответа от родительского процесса)
      this.isRefreshing = true;

      // Очищаем очередь, это нужно для того, чтобы не было множества запросов на обновление токена.
      // Это сигнал для всех ожидающих запросов, что нужно ждать обновление токена.
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        // switchMap - оператор RxJS для преобразования значений в потоке.

        // switchMap - позволяет переключить поток на новый поток, основанный на предыдущем потоке.

        // Когда приходит новый токен, "переключается" на новый Observable.
        // Отменяет предыдущий Observable и начинает новый.
        switchMap((token: any) => {
          // Устанавливаем флаг, что токен перестает обновляться
          this.isRefreshing = false;

          // Добавляем новый токен в очередь

          // ВСЕ ЖДУЩИЕ ЗАПРОСЫ ПОЛУЧАЮТ НОВЫЙ ТОКЕН!!! (Думаю теперь понятно, зачем нам этот BehaviorSubject)
          this.refreshTokenSubject.next(token.access_token);

          // Возвращаем новый запрос с новым токеном
          return next.handle(this.addToken(req, token.access_token));
        }),

        // Обрабатываем ошибку
        catchError((err) => {
          // Устанавливаем флаг, что токен перестает обновляться также в случае ошибки
          this.isRefreshing = false;

          // Выходим из приложения, так как ошибка 
          // означает, что скорее всего refersh token тоже просрочился.
          
          // в logout мы очищаем access_token и refresh_token из localstorage
          this.authService.logout(this.authService.getRefreshToken() || "");

          // Переходим на страницу авторизации (для этого импортировали router)
          this.router.navigate(['/login']);
          return throwError(err);
        })
      );
      // Обрабатываем случай, если токен в процессе обновления
    } else {

      // Подписываемся на обновление токена, когда токен будет обновлен, 
      // остальные запросы получат этот новый токен
      return this.refreshTokenSubject.pipe(
        // Нам нужно игнорировать null, так как это сигнал, что токен еще не обновлен
        // и мы должны ждать обновления токена.

        // filter - оператор RxJS для фильтрации значений в потоке.
        filter((token) => token != null),

        // take - оператор RxJS для получения определенного количества значений из потока.
        // Нам нуджно получить только один токен.
        take(1),

        // switchMap - оператор RxJS для преобразования значений в потоке.

        // switchMap - позволяет переключить поток на новый поток, основанный на предыдущем потоке.

        // Когда приходит новый токен, "переключается" на новый Observable.
        switchMap((token) => {
          return next.handle(this.addToken(req, token as string));
        })
      );
    }
  }
}
