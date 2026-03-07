import {Injectable, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { isPlatformServer } from '@angular/common';



@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // На сервере всегда возвращаем true, так как
    // на сервере нет авторизации и нет необходимости проверять авторизацию
    if(isPlatformServer(this.platformId)){
      return true;
    }

    // На клиенте проверяем авторизацию, в частости, токен.
    if(this.authService.getAccessToken()) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: state.url
      }
    });

    return false;
  }
}