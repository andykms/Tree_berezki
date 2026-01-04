import { EProductStatus } from "../entities/product.entity";

export interface IGetProductParamResponse {
  id: string;
  value: string;
  measure: string;
  name: string;
  is_choosen: string;
}

export interface IGetProductImageResponse {
  id: number;
  position: number;
  url: string;
}

export interface IGetProductResponse {
  id: string;
  name: string;
  price_rubles: number;
  discount: number;
  description: string;
  count: number;
  article: number;
  status: EProductStatus;
  created_at: Date;
  params: IGetProductParamResponse[];
  category: string;
  comments_count: number;
  question_count: number;
  images: IGetProductImageResponse[];
  shop_name: string;
  showcaseProductsId: string;
}