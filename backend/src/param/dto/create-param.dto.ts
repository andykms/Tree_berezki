import {
  IsString,
  IsNumber,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  IsEnum,
} from 'class-validator';
import { EChoosenType } from '../entities/param.entity';

export class CreateParamDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(64)
  name: string;

  @IsEnum(EChoosenType)
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  is_choosen: EChoosenType;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  measureId: number;

  @IsNotEmpty()
  @IsString()
  shopId: string;
}
