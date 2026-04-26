import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ICreateProduct } from '../models/create-product.model';
import { IBaseResponse } from '../models/base-response.model';
import { IProduct } from '../models/product.model';
import { environment } from '../../../environments/environment';
import { IUploadResponse } from '../models/upload-response.model';
import { ICreateParam } from '../models/create-param.model';
import { IParam } from '../models/product.model';
import { IMeasure } from '../models/product.model';
import { ICategory } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  baseUrl: string = environment.apiUrl + '/product';
  uploadUrl: string = environment.apiUrl + '/upload';
  paramUrl: string = environment.apiUrl + '/param';
  categoryUrl: string = environment.apiUrl + '/category';
  measureUrl: string = environment.apiUrl + '/measure';

  create(data: ICreateProduct): Observable<IBaseResponse<IProduct>> {
    return this.http.post<IBaseResponse<IProduct>>(this.baseUrl, data);
  }

  uploadImage(image: File): Observable<IUploadResponse> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post<IUploadResponse>(this.uploadUrl, formData);
  }

  createParam(data: ICreateParam): Observable<IParam> {
    return this.http.post<IParam>(this.paramUrl, data);
  }

  getParams(limit: number, page: number): Observable<IBaseResponse<IParam>> {
    return this.http.get<IBaseResponse<IParam>>(this.paramUrl, { params: { limit, page } });
  }

  getMeasures(): Observable<IBaseResponse<IMeasure>> {
    return this.http.get<IBaseResponse<IMeasure>>(this.measureUrl, { params: { limit: 100, page: 1 } });
  }

  getCategories(): Observable<IBaseResponse<ICategory>> {
    return this.http.get<IBaseResponse<ICategory>>(this.categoryUrl);
  }

  getRequiredParams(categoryId: string): Observable<IBaseResponse<IParam>> {
    return this.http.get<IBaseResponse<IParam>>(this.categoryUrl + `/${categoryId}` + '/required-params');
  }
}
