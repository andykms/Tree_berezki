export interface IProduct {
  id: string;
  name: string;
  price: number;
  discount: number;
  description: string;
  image: IProductImage[];
  raiting: number;
  countRaiting: number;
  countQuestions: number;
  countPurchases: number;
  shop: string;
  article: string;
  category: string;
  params: IProductParam[];
  stars: IStars;
}  

export interface IProductImage {
  id: number;
  src: string;
}

export interface IProductParam {
  name: string;
  value: string;
  isChoosen: boolean;
}

export interface IStars {
  countFiveStar: number;
  countFourStar: number;
  countThreeStar: number;
  countTwoStar: number;
  countOneStar: number;
}