import { PartialType } from '@nestjs/mapped-types';
import { CreateShowcaseProductDto } from './create-showcase-product.dto';

export class UpdateShowcaseProductDto extends PartialType(
  CreateShowcaseProductDto,
) {}
