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
  replies: IReviewReply[];
}

export interface IReviewUser {
  userId: string;
  avatar: string;
  name: string;
  isShop: boolean;
}

export interface IReviewReply {
  id: string;
  reviewId: string;
  user: IReviewUser;
  comment: string;
  date: Date;
}


