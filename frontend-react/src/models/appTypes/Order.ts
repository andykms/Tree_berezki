export interface IOrder {
  products: IOrderProduct[];
  totalPrice: number;
}

export interface IOrderProduct {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrderAddress {
  address: string;
  isPrivateSector: boolean;
  home: IOrderHome;
  isRecipientFromAccount: boolean;
  recipient: IOrderRecipient;
  deliveryDate: IOrderDate;
  payment: IOrderPayment;
}

export interface IOrderHome {
  entrance: string;
  intercomCode: string;
  floor: string;
  flat: string;
  freightElevator: boolean;
  barrier: boolean;
  comment: string;
}

export interface IOrderRecipient {
  recipient: string;
  phone: string;
  secondPhone?: string;
}

export interface IOrderDate {
  delivaryDates: Date[];
  choosenDelivaryDate: Date;
  choosenDelivaryTime: "morning" | "afternoon" | "evening";
}

export interface IOrderPayment {
  paymentMethod: "sbp" | "card" | "berezcoin";
}