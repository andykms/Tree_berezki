import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(128)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  price_rubles: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(80)
  discount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(2 ** 32)
  count: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(192)
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(192)
  showcaseId: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateProductParamDto)
  @ValidateNested({ each: true })
  @MaxLength(64)
  params: CreateProductParamDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(192)
  shopId: string;

  @IsNotEmpty()
  @IsArray()
  @Type(() => CreateProductImageDto)
  @ValidateNested({ each: true })
  images: CreateProductImageDto[];
}

export class CreateProductParamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(192)
  paramId: string;
  value: string;
}

export class CreateProductImageDto {
  url: string;
  position: number;
}
