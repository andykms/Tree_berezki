export interface IBasket {
  products: IBasketProduct[];
  totalPrice: number;
  totalQuantity: number;
}

export interface IBasketProduct {
  productId: string;
  quantity: number;
  price: number;
  isChoosen: boolean;
}