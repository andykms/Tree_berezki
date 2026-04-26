import { Component, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ShopService } from '../../core/services/shop.service';
import { IProduct, EProductStatus } from '../../core/models/product.model';

@Component({
  selector: 'app-showcase',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.css']
})
export class ShowcaseComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shopService = inject(ShopService);
  private destroyRef = inject(DestroyRef);

  // Получаем параметры маршрута
  private params$ = this.route.paramMap;
  private queryParams$ = this.route.queryParamMap;

  // Из параметров достаём showcaseId
  showcaseId = toSignal(
    this.params$.pipe(map(params => params.get('showcaseId'))),
    { initialValue: null }
  );

  // Из параметров достаем shopId
  shopId = toSignal(
    this.queryParams$.pipe(map(params => params.get('shopId'))),
    { initialValue: null }
  );

  // Загрузка данных с помощью toSignal
  private products$ = this.params$.pipe(
    map(params => params.get('showcaseId')),
    switchMap(showcaseId => {
      if (!showcaseId) return of({ items: [], total: 0 });
      return this.shopService.getShowcaseProducts(showcaseId).pipe(
        catchError(err => {
          console.error(err);
          this.error.set('Не удалось загрузить товары');
          return of({ items: [], total: 0 });
        })
      );
    })
  );

  // Сигнал с товарами (предполагаем, что ответ содержит поле items: IProduct[])
  products = toSignal(this.products$, { initialValue: { items: [], total: 0 } });

  // Состояния загрузки и ошибки
  loading = signal(true);
  error = signal<string | null>(null);

  // Для каждого товара храним текущий индекс изображения в карусели
  protected imageIndices = new Map<string, number>();

  protected reloadPage(): void {
    this.loading.set(true);
    this.error.set(null);
    this.router.navigate(['/showcase', this.showcaseId()]);
  }

  constructor() {
    // Управление состоянием загрузки
    this.products$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }

  // Получение текущего индекса изображения для товара
  getCurrentImageIndex(productId: string): number {
    return this.imageIndices.get(productId) || 0;
  }

  // Переключение изображения в карусели
  nextImage(productId: string, imagesCount: number, event: Event): void {
    event.stopPropagation();
    const current = this.getCurrentImageIndex(productId);
    const next = (current + 1) % imagesCount;
    this.imageIndices.set(productId, next);
  }

  prevImage(productId: string, imagesCount: number, event: Event): void {
    event.stopPropagation();
    const current = this.getCurrentImageIndex(productId);
    const prev = (current - 1 + imagesCount) % imagesCount;
    this.imageIndices.set(productId, prev);
  }

  // Форматирование цены со скидкой
  getDiscountedPrice(price: number, discount: number): number {
    return price - (price * discount) / 100;
  }

  // Получение текста статуса
  getStatusText(status: EProductStatus): string {
    switch (status) {
      case EProductStatus.SALED: return 'Продан';
      case EProductStatus.BLOCKED: return 'Заблокирован';
      case EProductStatus.DELETED: return 'Удалён';
      default: return 'Неизвестно';
    }
  }

  // Цвет статуса
  getStatusClass(status: EProductStatus): string {
    switch (status) {
      case EProductStatus.SALED: return 'status-saled';
      case EProductStatus.BLOCKED: return 'status-blocked';
      case EProductStatus.DELETED: return 'status-deleted';
      default: return '';
    }
  }

  // Переход на страницу товара
  goToProduct(productId: string): void {
    this.router.navigate(['/product', productId]);
  }

  // Переход на страницу создания товара
  createProduct(): void {
    this.router.navigate(['/product/create'], {
      queryParams: { showcaseId: this.showcaseId(), shopId: this.shopId() }
    });
  }

  // Назад (используем историю браузера)
  goBack(): void {
    window.history.back();
  }
}