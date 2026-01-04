import { GetProductsResponseDto } from "./get-products-response.dto"

export class GetShowcaseProductResponseDto {
  products: GetProductsResponseDto;
  name: string;
  rating: number;
}