export interface IUserOrder {
  id: string;
  userId: string;
  dateCreate: string;
  dateUpdate: string;
  status: "pending" | "completed" | "cancelled";
  products: IUserOrderProduct[];
  totalPrice: number;
  address: string;
}

export interface IUserOrderProduct {
  id: string;
  orderId: string;
  productId: string;
  image: string;
  quantity: number;
}