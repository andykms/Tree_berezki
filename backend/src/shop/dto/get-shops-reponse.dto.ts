import { IGetShopResponse } from './get-shop-response.dto';

export class GetShopsResponseDto {
  items: IGetShopResponse[];
  total: number;
}
