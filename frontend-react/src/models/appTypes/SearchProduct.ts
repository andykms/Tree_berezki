import type {IProduct} from "./Product";

export interface ISearchProducts {
  search: string;
  limit: number;
  offset: number;
  products: IProduct[];
}

