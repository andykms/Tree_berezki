import type { IProduct } from './Product';

export interface IUserProductLikes {
  userId: string;
  likes: IProduct[];
}
