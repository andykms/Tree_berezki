import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { CreateShowcaseProductDto } from '../../showcase-products/dto/create-showcase-product.dto';

export class UpdateShopDto extends PartialType(CreateShopDto) {}
