import { IGetProductResponse } from './get-product-response.dto';

export class GetProductsResponseDto {
  items: IGetProductResponse[];
  total: number;
}
