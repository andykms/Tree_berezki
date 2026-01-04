export interface IReview {
  id: string;
  productId: string;
  user: IReviewUser;
  raiting: number;
  advantage: string;
  disadvantage: string;
  comment: string;
  date: Date;
  likes: number;
  dislikes: number;
  images: string[];
}

export interface IReviewUser {
  userId: string;
  avatar: string;
  name: string;
  isShop: boolean;
}



