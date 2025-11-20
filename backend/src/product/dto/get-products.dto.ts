import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class GetProductQueryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  limit: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  search: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  sortBy: 'minprice' | 'maxprice' | 'popular' | 'new';

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  minprice: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  maxprice: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  category: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  param: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  shop: string;
}
