import { IShop } from "./shop.model";


export interface IUser {
  id: string;
  phone: string;
  shops?: IShop[];
}