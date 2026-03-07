import { IShop } from "./shop.model";

export interface IShowcase {
  id: string;
  name: string;
  rating: number;
  shop: IShop;
}