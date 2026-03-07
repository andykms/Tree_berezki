import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ShopService } from '../../core/services/shop.service';
import { AuthService } from '../../core/services/auth.service';
import { ICreateShop } from '../../core/models/create-shop.model';
import { ICreateShopResponse } from '../../core/models/create-shop-response.model';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class CreateShopComponent implements OnInit, OnDestroy {
  createShopForm!: FormGroup;
  isLoading = signal<boolean>(false);
  serverError = '';
  submitted = false;
  countries = ['Россия', 'Беларусь', 'Новороссия', 'Малороссия', 'Казахстан'];
  isBrowser: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.isBrowser && !this.authService.isAuthenticated) {
      this.router.navigate(['/login']);
    }

    this.createShopForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.serverError = '';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.createShopForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
        email: ['', [Validators.required, Validators.email]],
        organization: [
          '',
          [Validators.required, Validators.minLength(2), Validators.maxLength(192)],
        ],
        INN: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\d{10}$|^\d{12}$/),
            this.innValidator.bind(this),
          ],
        ],
        OGRN: ['', [
        Validators.required,
        Validators.pattern(/^\d{13}$|^\d{15}$/),
        this.ogrnValidator
      ]],
        country: ['Россия', Validators.required],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\+7\d{10}$/),
            this.phoneFormatValidator.bind(this),
          ],
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.passwordStrengthValidator.bind(this)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator.bind(this),
      }
    );
  }

  private passwordMatchValidator(group: FormGroup): Validators | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    group.get('confirmPassword')?.setErrors(null);
    return null;
  }

  private passwordStrengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: { [key: string]: boolean } = {};

    if (!hasUpperCase) {
      errors['missingUpperCase'] = true;
    }
    if (!hasLowerCase) {
      errors['missingLowerCase'] = true;
    }
    if (!hasNumber) {
      errors['missingNumber'] = true;
    }
    if (!hasSpecialChar) {
      errors['missingSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  private innValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const inn = control.value;
    if (!inn) {
      return null;
    }

    if (inn.length !== 10 && inn.length !== 12) {
      return { innLength: true };
    }
    if (inn.length === 10 && !/^\d{10}$/.test(inn)) {
      return { innInvalid: true };
    }
    if (inn.length === 12 && !/^\d{12}$/.test(inn)) {
      return { innInvalid: true };
    }

    return null;
  }

  private ogrnValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }

    const ogrn = control.value;

    if (ogrn.length !== 13 && ogrn.length !== 15) {
      return { ogrnLength: true };
    }

    return null;
  }

  private phoneFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }

    const phone = control.value;

    if (!/^\+7/.test(phone)) {
      return { phoneFormat: true };
    }

    const digitsOnly = phone.substring(2);
    if (!/^\d{10}$/.test(digitsOnly)) {
      return { phoneDigits: true };
    }

    return null;
  }

  get name() {
    return this.createShopForm.get('name');
  }

  get email() {
    return this.createShopForm.get('email');
  }

  get organization() {
    return this.createShopForm.get('organization');
  }

  get inn() {
    return this.createShopForm.get('INN');
  }

  get ogrn() {
    return this.createShopForm.get('OGRN');
  }

  get country() {
    return this.createShopForm.get('country');
  }

  get phone() {
    return this.createShopForm.get('phone');
  }

  get password() {
    return this.createShopForm.get('password');
  }

  get confirmPassword() {
    return this.createShopForm.get('confirmPassword');
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.createShopForm.get(fieldName);
    return !!field && field.invalid && (this.submitted || field.touched || field.dirty);
  }

  getFieldError(fieldName: string): string {
    const field = this.createShopForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Это поле обязательно';
    }

    if (field.errors['minlength']) {
      return `Минимальная длина ${field.errors['minlength'].requiredLength} символов`;
    }

    if (field.errors['maxlength']) {
      return `Максимальная длина ${field.errors['maxlength'].requiredLength} символов`;
    }

    if (fieldName === 'name') {
      return 'Введите название магазина';
    }

    if (fieldName === 'email') {
      if (field.errors['email']) {
        return 'Введите корректный email адрес';
      }
    }

    if (fieldName === 'organization') {
      return 'Введите название организации';
    }

    if (fieldName === 'INN') {
      if (field.errors['pattern']) {
        return 'ИНН должен содержать 10 или 12 цифр';
      }
      if (field.errors['innLength']) {
        return 'ИНН должен содержать 10 цифр (для ИП) или 12 цифр (для организаций)';
      }
      if (field.errors['innInvalid']) {
        return 'Неверный формат ИНН';
      }
    }

    if (fieldName === 'OGRN') {
      if (field.errors['pattern']) {
        return 'ОГРН должен содержать 13 цифр (для организаций) или 15 цифр (для ИП)';
      }

      if (field.errors['ogrnLength']) {
        return 'ОГРН должен содержать 13 цифр (для организаций) или 15 цифр (для ИП)';
      }
    }

    if (fieldName === 'phone') {
      if (field.errors['phoneFormat']) {
        return 'Телефон должен начинаться с +7';
      }
      if (field.errors['phoneDigits']) {
        return 'После +7 должно быть ровно 10 цифр';
      }
      if (field.errors['pattern']) {
        return 'Неверный формат телефона. Пример: +71234567890';
      }
    }

    if (fieldName === 'password') {
      if (field.errors['missingUpperCase']) {
        return 'Добавьте хотя бы одну заглавную букву';
      }
      if (field.errors['missingLowerCase']) {
        return 'Добавьте хотя бы одну строчную букву';
      }
      if (field.errors['missingNumber']) {
        return 'Добавьте хотя бы одну цифру';
      }
      if (field.errors['missingSpecialChar']) {
        return 'Добавьте хотя бы один специальный символ (!@#$%^&*...)';
      }
    }

    if (fieldName === 'confirmPassword' && field.errors['passwordMismatch']) {
      return 'Пароли не совпадают';
    }

    return 'Неверное значение';
  }

  formatInn(event: any): void {
    if (!this.isBrowser) return;

    let value = event.target.value.replace(/\D/g, '');

    // Ограничиваем длину
    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    this.inn?.setValue(value, { emitEvent: false });
  }

  formatOgrn(event: any): void {
    if (!this.isBrowser) return;

    let value = event.target.value.replace(/\D/g, '');

    // Ограничиваем длину
    if (value.length > 15) {
      value = value.substring(0, 15);
    }

    this.ogrn?.setValue(value, { emitEvent: false });
  }

  formatPhone(event: any): void {
    if (!this.isBrowser) return;

    let value = event.target.value.replace(/\D/g, '');

    if (value.startsWith('7')) {
      value = '+7' + value.substring(1);
    } else if (value.startsWith('8')) {
      value = '+7' + value.substring(1);
    } else if (!value.startsWith('+')) {
      value = '+7' + value;
    }

    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) {
      value = '+7' + digits.substring(1, 11);
    }

    this.phone?.setValue(value, { emitEvent: false });
  }

  togglePasswordVisibility(fieldName: string, event: Event): void {
    if (!this.isBrowser) return;

    event.preventDefault();
    const input = document.querySelector(`[formControlName="${fieldName}"]`) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }

  onSubmit(): void {

    this.submitted = true;
    this.serverError = '';

    Object.keys(this.createShopForm.controls).forEach((key) => {
      const control = this.createShopForm.get(key);
      control?.markAsTouched();
    });

    if (this.createShopForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const shopData: ICreateShop = {
      name: this.name?.value,
      email: this.email?.value,
      organization: this.organization?.value,
      INN: this.inn?.value,
      OGRN: this.ogrn?.value,
      country: this.country?.value,
      phone: this.phone?.value,
      password: this.password?.value,
    };

    this.shopService
      .registerShop(shopData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ICreateShopResponse) => {
          this.isLoading.set(false);

          if (response && response.items && response.items.length > 0) {
            const shopId = response.items[0].id;
            this.router.navigate(['/shop', shopId]);
          } else {
            this.serverError = `Не удалось создать магазин`;
          }
        },
        error: (error) => {
          this.isLoading.set(false);

          if (error.status === 400) {
            if (error.error?.message?.includes('уже существует')) {
              this.serverError = 'Магазин с такими данными уже существует';
            } else {
              this.serverError = 'Некорректные данные для создания магазина';
            }
          } else if (error.status === 409) {
            this.serverError = 'Магазин с такими данными уже существует';
          } else if (error.status === 401 || error.status === 403) {
            this.serverError = 'Требуется авторизация';
            this.authService.logout(this.authService.getRefreshToken() || '');
            this.router.navigate(['/login']);
          } else if (error.status === 0) {
            this.serverError = 'Нет соединения с сервером';
          } else if (error.status >= 500) {
            this.serverError = 'Ошибка сервера. Попробуйте позже';
          } else {
            this.serverError = 'Не удалось создать магазин';
          }

          // Сбрасываем поля паролей
          this.password?.reset();
          this.confirmPassword?.reset();
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }

  get validSpecialChar() {
    return /[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(this.password?.value)
  }
}
