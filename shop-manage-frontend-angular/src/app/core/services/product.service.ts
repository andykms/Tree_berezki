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

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  baseUrl: string = environment.apiUrl + '/product';
  uploadUrl: string = environment.apiUrl + '/upload';
  paramUrl: string = environment.apiUrl + '/param';

  async create(data: ICreateProduct): Promise<Observable<IBaseResponse<IProduct>>> {
    return this.http.post<IBaseResponse<IProduct>>(this.baseUrl, data);
  }

  async uploadImage(image: File): Promise<Observable<IUploadResponse>> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<IUploadResponse>(this.uploadUrl, formData);
  }

  async createParam(data: ICreateParam): Promise<Observable<IParam>> {
    return this.http.post<IParam>(this.paramUrl, data);
  }

  async getParams(limit: number, page: number): Promise<Observable<IBaseResponse<IParam[]>>> {
    const params = new HttpParams();
    params.append('limit', limit.toString());
    params.append('page', page.toString());

    return this.http.get<IBaseResponse<IParam[]>>(this.paramUrl, { params });
  }

  async getMeasures(): Promise<Observable<IBaseResponse<IMeasure[]>>> {
    const params = new HttpParams();
    params.append('limit', '100');
    params.append('page', '1');
    return this.http.get<IBaseResponse<IMeasure[]>>(this.paramUrl, { params });
  }
}
