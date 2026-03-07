import { IBaseResponse } from "./base-response.model";
import { IProduct } from "./product.model";

export interface ICreateProductResponse extends IBaseResponse<IProduct> {}