export interface IQuestions {
  questions: IQuestion[];
  productId: string;
}

export interface IQuestion {
  id: string;
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