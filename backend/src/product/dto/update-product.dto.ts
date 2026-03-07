import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsArray,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @IsNumber()
  @Min(1)
  price_rubles: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(80)
  discount: number;

  @IsString()
  @MaxLength(1024)
  description: string;

  @IsNumber()
  @Min(1)
  @Max(2 ** 32)
  count: number;

  @IsString()
  @MaxLength(192)
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(192)
  showcaseId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(192)
  shopId: string;

  @IsArray()
  @IsOptional()
  @Type(() => UpdateProductParamDto)
  @ValidateNested({ each: true })
  @MaxLength(64)
  params: UpdateProductParamDto[];

  @IsArray()
  @IsOptional()
  @Type(() => UpdateProductImageDto)
  @ValidateNested({ each: true })
  images: UpdateProductImageDto[];
}

export class UpdateProductParamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(192)
  paramId: string;
  value: string;
}

export class UpdateProductImageDto {
  url: string;
  position: number;
}
