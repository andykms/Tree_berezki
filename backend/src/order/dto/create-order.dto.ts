import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsPhoneNumber,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EDeliveryTime } from '../entities/order.entity';

const minPhoneLen = '89999999999'.length;
const maxPhoneLen = '+7-(999)-999-99-99'.length;

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(10)
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['true', 'false'])
  @MinLength(2)
  @MaxLength(16)
  privateSector: 'true' | 'false';

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(0)
  entrance: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @MinLength(0)
  intercomCode: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(0)
  floor: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(0)
  flat: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['true', 'false'])
  @MaxLength(16)
  @MinLength(0)
  freightElevator: 'true' | 'false';

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(0)
  comment: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(2)
  recipient: string;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  @MinLength(minPhoneLen)
  @MaxLength(maxPhoneLen)
  phone: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  @MinLength(minPhoneLen)
  @MaxLength(maxPhoneLen)
  secondPhone: string;

  @IsNotEmpty()
  @IsDateString()
  @MinLength(10)
  @MaxLength(32)
  deliveryDate: Date;

  @IsNotEmpty()
  @IsString()
  @IsEnum(EDeliveryTime)
  @MinLength(2)
  @MaxLength(16)
  deliveryTime: EDeliveryTime;

  @IsNotEmpty()
  @IsNumber()
  @Max(2 ** 32)
  @Min(0)
  total: number;

  @IsNotEmpty()
  @IsArray()
  @MinLength(1)
  @MaxLength(2 ** 32)
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  accountId: string;
}

export class CreateOrderProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(2 ** 32)
  @Min(1)
  count: number;
}
