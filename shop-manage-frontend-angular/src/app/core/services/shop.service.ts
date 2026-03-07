import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";


import { ICreateShop } from "../models/create-shop.model";
import { environment } from "../../../environments/environment";
import { ICreateShopResponse } from "../models/create-shop-response.model";
import { ICreateShowcase } from "../models/create-showcase.model";
import { IUpdateShop } from "../models/update-shop.model";
import { IShowcase } from "../models/showcase.model";
import { IBaseResponse } from "../models/base-response.model";

@Injectable({providedIn: 'root'})
export class ShopService {
  constructor(
    private http: HttpClient
  ) {}

  baseUrl = environment.apiUrl + "/shop";

  registerShop(data: ICreateShop): Observable<ICreateShopResponse> {
    return this.http.post(this.baseUrl, data) as Observable<ICreateShopResponse>;
  }

  async getShop(id: string): Promise<Observable<ICreateShopResponse>> {
    const params = new HttpParams().set("id", id);
    return this.http.get(this.baseUrl, { params }) as Observable<ICreateShopResponse>;
  }

  async updateShop(id: string, data: IUpdateShop): Promise<Observable<ICreateShopResponse>> {
    const params = new HttpParams().set("id", id);
    return this.http.patch(this.baseUrl, data, { params }) as Observable<ICreateShopResponse>;
  }

  getShowcaseProducts(shopId: string): Observable<IBaseResponse<IShowcase>> {
    const url = this.baseUrl + `/${shopId}/showcase`;
    return this.http.get(url) as Observable<IBaseResponse<IShowcase>>;
  }

  createShowcaseProduct(shopId: string, data: ICreateShowcase): Observable<ICreateShowcase>  {
    const url = this.baseUrl + `/${shopId}/showcase`;
    return this.http.post<ICreateShowcase>(url, {shopId, ...data});
  }
}