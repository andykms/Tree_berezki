import {
  Component,
  inject,
  signal,
  computed,
  DestroyRef,
  OnInit,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import {
  switchMap,
  map,
  catchError,
  of,
  tap,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  finalize
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Библиотеки
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Сервисы и модели
import { ProductService } from '../../core/services/product.service';
import { ShopService } from '../../core/services/shop.service';
import { ICategory, IParam, IMeasure } from '../../core/models/product.model';
import { ICreateProduct, ICreateProductParam, ICreateProductImage } from '../../core/models/create-product.model';
import { IUploadResponse } from '../../core/models/upload-response.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    InfiniteScrollModule
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private shopService = inject(ShopService);
  private destroyRef = inject(DestroyRef);

  // Сигналы состояния
  isLoading = signal(false);
  uploading = signal(false);
  error = signal<string | null>(null);

  // Данные с toSignal
  private categories$ = this.productService.getCategories().pipe(
    map(res => (res as any).items || []),
    catchError(err => {
      console.error(err);
      this.error.set('Ошибка загрузки категорий');
      return of([]);
    })
  );
  categories = toSignal(this.categories$, { initialValue: [] });

  private measures$ = this.productService.getMeasures().pipe(
    map(res => (res as any).items || []),
    catchError(err => {
      console.error(err);
      this.error.set('Ошибка загрузки единиц измерения');
      return of([]);
    })
  );
  measures = toSignal(this.measures$, { initialValue: [] });

  // Существующие параметры для бесконечного скролла
  existingParamsPage = signal(1);
  existingParamsTotal = signal(0);
  loadingExistingParams = signal(false);
  existingParams = signal<IParam[]>([]);

  // Параметры маршрута
  private shopId = signal<string | null>(null);
  private showcaseId = signal<string | null>(null);

  // Форма
  productForm: FormGroup;

  // Изображения (локальные)
  images = signal<{ file: File; url: string; position: number }[]>([]);
  currentImageIndex = signal(0);

  private readonly MAX_IMAGES = 10;
  private readonly API_URL = environment.apiUrl;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      price_rubles: [null, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.maxLength(500)]],
      count: [null, [Validators.required, Validators.min(1)]],
      categoryId: [null, Validators.required],
      requiredParams: this.fb.array([]),
      extraParams: this.fb.array([])
    });

    // Получаем shopId и showcaseId из query параметров
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.shopId.set(params['shopId'] || null);
        this.showcaseId.set(params['showcaseId'] || null);
        if (!this.shopId() || !this.showcaseId()) {
          this.error.set('Не указан магазин или витрина');
        }
      });

    // Загрузка обязательных параметров при изменении категории
    this.productForm.get('categoryId')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(categoryId => {
          if (!categoryId) return of([]);
          return this.productService.getRequiredParams(categoryId).pipe(
            map(res => (res as any).items || []),
            catchError(err => {
              console.error(err);
              this.error.set('Ошибка загрузки обязательных параметров');
              return of([]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {
        this.buildRequiredParamsForm(params);
      });
  }

  ngOnInit(): void {
    this.loadExistingParams(1);
  }

  // Построение формы обязательных параметров
  private buildRequiredParamsForm(params: IParam[]): void {
    const requiredArray = this.productForm.get('requiredParams') as FormArray;
    requiredArray.clear();
    params.forEach(param => {
      const group = this.fb.group({
        paramId: [param.id, Validators.required],
        value: ['', Validators.required],
        name: [param.name],
        measureValue: [param.measure?.value || '']
      });
      requiredArray.push(group);
    });
  }

  // Загрузка существующих параметров (бесконечный скролл)
  loadExistingParams(page: number = 1): void {
    console.log("Я ВЫЗЫВАЮСЬ")
    if (this.loadingExistingParams()) return;
    console.log("Я ТОЖЕ")
    this.loadingExistingParams.set(true);
    this.productService.getParams(10, page)
      .pipe(
        map(res => (res as any).items || []),
        catchError(err => {
          console.error(err);
          return of([]);
        }),
        finalize(() => this.loadingExistingParams.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(items => {
        this.existingParams.update(current => [...current, ...items]);
        this.existingParamsPage.set(page + 1);
        // total можно получить из ответа, если нужно
      });
  }

  // Геттеры для форм
  get requiredParamsArray(): FormArray {
    return this.productForm.get('requiredParams') as FormArray;
  }

  get extraParamsArray(): FormArray {
    return this.productForm.get('extraParams') as FormArray;
  }

  // Добавление дополнительного параметра
  addExtraParam(): void {
    const group = this.fb.group({
      type: ['existing'],
      paramId: [null, Validators.required],
      value: ['', Validators.required],
      newParamName: [''],
      newParamMeasureId: [null],
      paramName: [''],
      measureValue: ['']
    });
    this.extraParamsArray.push(group);
  }

  removeExtraParam(index: number): void {
    this.extraParamsArray.removeAt(index);
  }

  onExtraParamTypeChange(index: number, type: string): void {
    const group = this.extraParamsArray.at(index);
    group.patchValue({ type });
    if (type === 'existing') {
      group.get('newParamName')?.clearValidators();
      group.get('newParamMeasureId')?.clearValidators();
    } else {
      group.get('newParamName')?.setValidators([Validators.required]);
      group.get('newParamMeasureId')?.setValidators([Validators.required]);
    }
    group.get('newParamName')?.updateValueAndValidity();
    group.get('newParamMeasureId')?.updateValueAndValidity();
  }

  createNewParam(index: number): void {
    const group = this.extraParamsArray.at(index);
    const name = group.get('newParamName')?.value;
    const measureId = group.get('newParamMeasureId')?.value;
    if (!name || !measureId) return;

    this.isLoading.set(true);
    this.productService.createParam({
      name,
      is_choosen: 'false',
      measureId,
      shopId: this.shopId()!
    })
      .pipe(
        catchError(err => {
          console.error(err);
          this.error.set('Ошибка создания параметра');
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(newParam => {
        if (newParam) {
          group.patchValue({
            paramId: (newParam as any).id,
            paramName: (newParam as any).name,
            measureValue: (newParam as any).measure?.value
          });
          group.patchValue({ type: 'existing' });
        }
      });
  }

  // Работа с изображениями
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const totalNew = files.length + this.images().length;
    if (totalNew > this.MAX_IMAGES) {
      this.error.set(`Можно загрузить не более ${this.MAX_IMAGES} изображений`);
      return;
    }

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      this.images.update(imgs => [
        ...imgs,
        { file, url, position: imgs.length + 1 }
      ]);
    });

    input.value = '';
  }

  removeImage(index: number): void {
    const img = this.images()[index];
    URL.revokeObjectURL(img.url); // очистка памяти
    this.images.update(imgs => {
      const newImgs = imgs.filter((_, i) => i !== index);
      return newImgs.map((img, i) => ({ ...img, position: i + 1 }));
    });
    if (this.currentImageIndex() >= this.images().length) {
      this.currentImageIndex.set(Math.max(0, this.images().length - 1));
    }
  }

  moveImageLeft(index: number): void {
    if (index === 0) return;
    this.images.update(imgs => {
      const newImgs = [...imgs];
      [newImgs[index - 1], newImgs[index]] = [newImgs[index], newImgs[index - 1]];
      return newImgs.map((img, i) => ({ ...img, position: i + 1 }));
    });
  }

  moveImageRight(index: number): void {
    if (index === this.images().length - 1) return;
    this.images.update(imgs => {
      const newImgs = [...imgs];
      [newImgs[index], newImgs[index + 1]] = [newImgs[index + 1], newImgs[index]];
      return newImgs.map((img, i) => ({ ...img, position: i + 1 }));
    });
  }

  setCurrentImageIndex(index: number): void {
    this.currentImageIndex.set(index);
  }

  prevImage(): void {
    this.currentImageIndex.update(i => (i > 0 ? i - 1 : this.images().length - 1));
  }

  nextImage(): void {
    this.currentImageIndex.update(i => (i < this.images().length - 1 ? i + 1 : 0));
  }

  // Отправка формы
  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (!this.shopId() || !this.showcaseId()) {
      this.error.set('Не указан магазин или витрина');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // 1. Загружаем все изображения параллельно
    this.uploading.set(true);
    const uploadTasks = this.images().map(img =>
      this.productService.uploadImage(img.file).pipe(
        map(response => ({
          position: img.position,
          filename: response.filename,
          originalName: response.originalName
        }))
      )
    );

    forkJoin(uploadTasks).pipe(
      switchMap(uploadedImages => {
        this.uploading.set(false);
        // Формируем массив images для DTO
        const productImages: ICreateProductImage[] = uploadedImages.map(img => ({
          url: `${this.API_URL}/uploads/${img.filename}`,
          position: img.position
        }));

        // 2. Собираем параметры
        const requiredParams: ICreateProductParam[] = this.requiredParamsArray.value.map((p: any) => ({
          paramId: p.paramId,
          value: p.value
        }));

        const extraParams: ICreateProductParam[] = this.extraParamsArray.value
          .filter((p: any) => p.paramId)
          .map((p: any) => ({
            paramId: p.paramId,
            value: p.value
          }));

        const productData: ICreateProduct = {
          name: this.productForm.value.name,
          price_rubles: this.productForm.value.price_rubles,
          discount: this.productForm.value.discount || 0,
          description: this.productForm.value.description || '',
          count: this.productForm.value.count,
          categoryId: this.productForm.value.categoryId,
          showcaseId: this.showcaseId()!,
          params: [...requiredParams, ...extraParams],
          shopId: this.shopId()!,
          images: productImages
        };

        // 3. Создаём товар
        return this.productService.create(productData);
      }),
      catchError(err => {
        console.error(err);
        this.error.set('Ошибка при создании товара');
        return of(null);
      }),
      finalize(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(response => {
      if (response) {
        // Очищаем ObjectURL после успешной отправки
        this.images().forEach(img => URL.revokeObjectURL(img.url));
        this.router.navigate(['/showcase', this.showcaseId()]);
      }
    });
  }

  // Отмена
  goBack(): void {
    // Очищаем созданные ObjectURL
    this.images().forEach(img => URL.revokeObjectURL(img.url));
    window.history.back();
  }
}