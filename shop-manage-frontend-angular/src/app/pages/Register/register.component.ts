import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { ICreateUser } from '../../core/models/create-user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true,
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isLoading = false;
  serverError = '';
  submitted = false;
  isBrowser = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initializeForm();

    // Если пользователь уже авторизован, перенаправляем
    if (this.isBrowser && this.authService.isAuthenticated) {
      this.router.navigate(['/user']);
    }

    // Подписка на изменения формы
    if (this.isBrowser) {
      this.registerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.serverError = '';
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\+7\d{10}$/), this.phoneFormatValidator],
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.passwordStrengthValidator],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Валидатор для проверки совпадения паролей
  private passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      group.get('confirmPassword')?.setErrors(null);
      return null;
    }
  };

  // Валидатор сложности пароля
  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const errors: ValidationErrors = {};

    if (!hasUpperCase) {
      errors['missingUpperCase'] = true;
    }
    if (!hasLowerCase) {
      errors['missingLowerCase'] = true;
    }
    if (!hasNumeric) {
      errors['missingNumber'] = true;
    }
    if (!hasSpecialChar) {
      errors['missingSpecialChar'] = true;
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  // Валидатор формата телефона
  private phoneFormatValidator(control: AbstractControl): ValidationErrors | null {
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

  // Геттеры для удобного доступа к полям формы
  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Проверка, было ли поле touched и invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (this.submitted || field.touched || field.dirty);
  }

  // Получение сообщения об ошибке для поля
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);

    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Это поле обязательно';
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
      if (field.errors['minlength']) {
        return `Минимальная длина пароля: ${field.errors['minlength'].requiredLength} символов`;
      }
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
        return 'Добавьте хотя бы один специальный символ';
      }
    }

    if (fieldName === 'confirmPassword' && field.errors['passwordMismatch']) {
      return 'Пароли не совпадают';
    }

    return 'Неверное значение';
  }

  // Форматирование телефона при вводе
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

    setTimeout(() => {
      this.phone?.updateValueAndValidity();
    }, 0);
  }

  // Переключение видимости пароля
  togglePasswordVisibility(fieldName: string, event: Event): void {
    event.preventDefault();
    const input = document.querySelector(`[formControlName="${fieldName}"]`) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }

  // Обработка отправки формы
  onSubmit(): void {
    if (!this.isBrowser) return;

    this.submitted = true;
    this.serverError = '';

    // Помечаем все поля как touched для отображения ошибок
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    const userData: ICreateUser = {
      phone: this.phone?.value,
      password: this.password?.value,
    };

    this.authService
      .registerUser(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/user']);
        },
        error: (error) => {
          this.isLoading = false;

          // Обработка ошибок сервера
          if (error.status === 400) {
            if (error.error?.message?.includes('уже существует')) {
              this.serverError = 'Пользователь с таким телефоном уже существует';
            } else {
              this.serverError = 'Некорректные данные для регистрации';
            }
          } else if (error.status === 409) {
            this.serverError = 'Пользователь с таким телефоном уже существует';
          } else if (error.status === 0) {
            this.serverError = 'Нет соединения с сервером';
          } else if (error.status >= 500) {
            this.serverError = 'Ошибка сервера. Попробуйте позже';
          } else {
            this.serverError = 'Не удалось создать аккаунт';
          }

          // Сбрасываем поля паролей
          this.password?.reset();
          this.confirmPassword?.reset();

          // Фокусируемся на поле телефона для удобства
          setTimeout(() => {
            const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement;
            phoneInput?.focus();
          }, 100);
        },
      });
  }
}
