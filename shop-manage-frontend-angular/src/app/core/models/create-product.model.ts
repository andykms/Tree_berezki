export interface ICreateProductParam {
  paramId: string;
  value: string;
}

export interface ICreateProduct {
  name: string;
  price_rubles: number;
  discount: number;
  description: string;
  count: number;
  categoryId: string;
  showcaseId: string;
  params: ICreateProductParam[];
  shopId: string;
  images: ICreateProductImage[];
}

export interface ICreateProductImage {
  url: string;
  position: number;
}