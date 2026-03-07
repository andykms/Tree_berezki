import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

import { ShopService } from '../../core/services/shop.service';
import { ICreateShowcase } from '../../core/models/create-showcase.model';

@Component({
  selector: 'app-create-showcase',
  templateUrl: './create-showcase.component.html',
  styleUrls: ['./create-showcase.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class CreateShowcaseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private shopService = inject(ShopService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Сигналы для состояния
  isLoading = signal(false);
  serverError = signal<string | null>(null);

  // Форма
  showcaseForm: FormGroup;

  // ID магазина из маршрута
  private shopId = toSignal(this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef), map(params => params.get('shopId') || "")), {initialValue: ""});

  constructor() {
    this.showcaseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {

    // Сбрасываем ошибку при изменении поля
    this.showcaseForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.serverError.set(null);
      });
  }


  // Геттер для удобного доступа в шаблоне
  get name() {
    return this.showcaseForm.get('name');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.showcaseForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  onSubmit(): void {
    if (this.showcaseForm.invalid || !this.shopId()) {
      // Помечаем поля как touched для отображения ошибок
      this.showcaseForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.serverError.set(null);

    const data: ICreateShowcase = {
      name: this.name?.value
    };
    
    // Вызов метода сервиса
    this.shopService.createShowcaseProduct(this.shopId(), data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          // После успешного создания переходим на страницу магазина
          this.router.navigate(['/shop', this.shopId()]);
        },
        error: (err) => {
          this.isLoading.set(false);
          // Обработка ошибок
          if (err.status === 400) {
            this.serverError.set('Некорректные данные');
          } else if (err.status === 401 || err.status === 403) {
            this.serverError.set('Требуется авторизация');
            // Можно выйти или перенаправить на логин
          } else if (err.status === 0) {
            this.serverError.set('Нет соединения с сервером');
          } else if (err.status >= 500) {
            this.serverError.set('Ошибка сервера. Попробуйте позже');
          } else {
            this.serverError.set('Не удалось создать группу');
          }
        }
      });
  }

  goBack(): void {
    if (this.shopId()) {
      this.router.navigate(['/shop', this.shopId()]);
    } else {
      this.router.navigate(['/user']);
    }
  }
}