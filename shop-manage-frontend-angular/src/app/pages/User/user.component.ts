import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../core/models/user-response.model';
import { IShop } from '../../core/models/shop.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserComponent implements OnInit, OnDestroy {
  user: IUser | null = null;
  shops: IShop[] = [];
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  isBrowser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData: IUser) => {
          this.user = userData;
          this.shops = userData.shops || [];
          this.isLoading.set(false);
        },
        error: (err) => {
          
          this.isLoading.set(false);
          if (err.status === 401 || err.status === 403) {
            // Если не авторизован, перенаправляем на логин
            this.error.set("Не авторизован")
            this.authService.logout(this.authService.getRefreshToken() || "");
            this.router.navigate(['/login']);
          } else if (err.status === 0) {
            this.error.set('Нет соединения с сервером');
          } else if (err.status >= 500) {
            this.error.set('Ошибка сервера. Попробуйте позже');
          } else {
            this.error.set('Не удалось загрузить данные');
          }
          
          console.error('Ошибка загрузки пользователя:', err);
        }
      });
  }

  getShopStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'work':
        return 'status-active';
      case 'blocked':
        return 'status-pending';
      case 'deleted':
        return 'status-suspended';
      default:
        return 'status-default';
    }
  }

  getShopStatusText(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Активен';
      case 'pending':
        return 'Ожидание';
      case 'suspended':
        return 'Приостановлен';
      default:
        return status || 'Неизвестно';
    }
  }

  formatDate(date: Date | string): string {
    if (!date) return '—';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '—';
    
    return dateObj.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  goToShop(shopId: string): void {
    if (this.isBrowser) {
      this.router.navigate([`/shop/${shopId}`]);
    }
  }

  createShop(): void {
    if (this.isBrowser) {
      this.router.navigate(['/create-shop']);
    }
  }

  refreshData(): void {
    this.loadUserData();
  }

  logout(): void {
    const token = this.authService.getRefreshToken();
    this.authService.logout(token || "");
    this.router.navigate(['/login']);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get activeShopsCount(): number {
    return this.shops.filter(s => s.status?.toLowerCase() === 'active').length
  }

  get pendingShopsCount(): number {
    return this.shops.filter(s => s.status?.toLowerCase() === 'pending').length
  }
}