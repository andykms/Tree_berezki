import { IShowcase } from "./showcase.model";

export enum EProductStatus {
  SALED = "saled",
  BLOCKED = "blocked",
  DELETED = "deleted"
}


export interface ICategory {
  id: string;
  path: string;
}


export interface IMeasure {
  id: string;
  value: string;
}

export interface IParam {
  id: string,
  name: string,
  is_choosen: 'true' | 'false'
  measure: IMeasure
}

export interface IProductParam {
  id: string;
  value: string;
  param: IParam;
}

export interface IProductImage {
  id: number;
  url: string;
  position: number;
}

export interface IProduct {
  id: string;
  name: string;
  price_rubles: number;
  discount: number;
  description: string;
  count: number;
  article: number;
  status: EProductStatus;
  purchase_count: number;
  created_at: Date;
  params: IProductParam[];
  category: ICategory,
  showcaseProducts: IShowcase;
  images: IProductImage[];
}