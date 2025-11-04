export interface IQuestion {
  id: string;
  productId: string;
  user: IQuestionUser;
  question: string;
  answer: string;
  date: Date;
}

export interface IQuestionUser {
  userId: string;
  avatar: string;
  name: string;
}