export interface IProductParam {
  id: string;
  value: string;
  param: {
    id: string;
    name: string;
    is_choosen: string;
    measure: {
      id: number;
      value: string;
    }
  }
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
  status: string;
  params: IProductParam[];
  purchase_count: number;
  category: {
    id: string;
    path: string;
  }
  showcaseProducts: {
    id: string;
  },
  images: IProductImage[];
}