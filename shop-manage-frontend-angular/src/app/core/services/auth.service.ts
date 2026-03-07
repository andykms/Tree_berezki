import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ICreateUser } from '../models/create-user.model';
import { ILoginResponse } from '../models/login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  private baseUrl = environment.apiUrl || 'http://localhost:3000';
  private loginUrl = `${this.baseUrl}/auth/login`;
  private registerUrl = `${this.baseUrl}/auth/register`;
  private logoutUrl = `${this.baseUrl}/auth/logout`;
  private refreshUrl = `${this.baseUrl}/auth/refresh`;

  login(data: ICreateUser) {
    return this.http.post(this.loginUrl, data).pipe(
      tap((res: any) => {
        const { accessToken, refreshToken } = res as ILoginResponse;
        if (accessToken && refreshToken) {
          this.setTokens({ accessToken, refreshToken });
        }
      })
    );
  }

  private setTokens(response: ILoginResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    }
  }

  private setOnlyAccessToken(response: { accessToken: string }): void {
    if (this.isBrowser) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
    }
  }

  getAccessToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  registerUser(data: ICreateUser) {
    return this.http
      .post(this.registerUrl, data)
      .pipe(tap((res: any) => this.setTokens(res as ILoginResponse)));
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();

    return this.http
      .post(
        this.refreshUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
      .pipe(tap((res: any) => this.setOnlyAccessToken(res)));
  }

  logout(refreshToken: string) {
    this.clearLocalStorage();

    // Отправляем запрос на сервер
    this.http
      .post(
        this.logoutUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
      .subscribe({
        complete: () => {
          // Очищаем localStorage в любом случае
          this.clearLocalStorage();
        },
      });
  }

  private clearLocalStorage(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  get isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
