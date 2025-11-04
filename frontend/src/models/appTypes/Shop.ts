import type { IProduct } from './Product';

export interface IShop {
  id: string;
  name: string;
  avatar: string;
  raiting: number;
  countRaiting: number;
  countProducts: number;
  products: IProduct[];
}