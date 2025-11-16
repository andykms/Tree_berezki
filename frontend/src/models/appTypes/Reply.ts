import type { IReviewUser } from "./Review";

export interface IReviewReply {
  id: string;
  reviewId: string;
  user: IReviewUser;
  comment: string;
  date: Date;
}