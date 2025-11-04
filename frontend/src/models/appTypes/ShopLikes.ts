export interface IUserShopLikes {
  userId: string;
  likes: IShopLike[];
}

export interface IShopLike {
  shopId: string;
  name: string;
  avatar: string;
  raiting: number;
}