import { Component, OnInit, OnDestroy, signal } from "@angular/core";
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { RouterLink } from "@angular/router";



import { AuthService } from "../../core/services/auth.service";
import { ILoginRequest } from "../../core/models/login-request.model";


@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  standalone: true
})
export class AuthComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = signal(false);
  serverError = signal("");
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated) {
      this.router.navigate(["/user"]);
    }

    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(()=>{
        this.serverError.set("");
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      phone: ["", [
        Validators.required,
        Validators.pattern(/^\+7\d{10}$/),
        this.phoneFormatValidator
      ]],
      password: ["", [Validators.required, Validators.minLength(1)]]
    })
  }

  private phoneFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if(!control.value) {
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

  get phone() {
    return this.loginForm.get("phone");
  }

  get password() {
    return this.loginForm.get("password");
  }

  isFieldInvalid(fieldName: string) {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (this.submitted || field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if(!field || !field.errors) {
      return "";
    }

    if(field.errors["required"]) {
      return "Заполните поле";
    }

    if(fieldName === "phone") {
      if(field.errors["phoneFormat"]) {
        return "Телефон должен начинаться с +7";
      }
      if (field.errors['phoneDigits']) {
        return 'После +7 должно быть ровно 10 цифр';
      }
      if (field.errors['pattern']) {
        return 'Неверный формат телефона. Пример: +71234567890';
      }
    }

    if (fieldName === 'password' && field.errors['minlength']) {
      return `Введите пароль`;
    }

    return 'Неверное значение'
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.startsWith('7')) {
      value = '+7' + value.substring(1);
    } else if (value.startsWith('8')) {
      value = '+7' + value.substring(1);
    } else if (!value.startsWith('+')) {
      value = '+7' + value;
    }
    
    // Ограничиваем длину: +7 и максимум 10 цифр
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) { // 11 цифр (7 + 10)
      value = '+7' + digits.substring(1, 11);
    }
    
    this.phone?.setValue(value, { emitEvent: false });
  }

  onSubmit(): void {
    this.submitted = true;
    this.serverError.set("");
    if(this.loginForm.invalid) {
      return;
    }

    this.isLoading.set(true);

    const loginData: ILoginRequest = {
      phone: this.phone?.value,
      password: this.password?.value
    }

    this.authService.login(loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response)=>{
          this.isLoading.set(false);
          this.router.navigate(["/user"]);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.status === 401 || error.status === 403) {
            this.serverError.set('Неверный логин или пароль');
          } else if (error.status === 0) {
            this.serverError.set('Нет соединения с сервером');
          } else if (error.status >= 500) {
            this.serverError.set('Ошибка сервера. Попробуйте позже');
          } else {
            this.serverError.set('Произошла ошибка при авторизации');
          }
        }
      })
  }
}