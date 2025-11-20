import {
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  IsString,
} from 'class-validator';
import { EOrderStatus, EDeliveryTime } from '../entities/order.entity';

export class UpdateOrderByUserDto {
  @IsOptional()
  @IsEnum([EOrderStatus.CANCELED])
  @MaxLength(16)
  @MinLength(3)
  status: EOrderStatus.CANCELED;

  @IsOptional()
  @IsEnum(EDeliveryTime)
  @MaxLength(16)
  @MinLength(3)
  deliveryTime: EDeliveryTime;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  @MinLength(3)
  comment: string;
}
