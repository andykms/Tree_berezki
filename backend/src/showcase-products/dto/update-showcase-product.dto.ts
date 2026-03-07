import { PartialType } from '@nestjs/mapped-types';
import { CreateShowcaseProductDto } from '../../showcase-products/dto/create-showcase-product.dto';

export class UpdateShowcaseProductDto extends PartialType(
  CreateShowcaseProductDto,
) {}
