import { IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { EOrderStatus, EDeliveryTime } from '../entities/order.entity';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(EOrderStatus)
  @MaxLength(16)
  @MinLength(3)
  status: EOrderStatus;

  @IsOptional()
  @IsEnum(EDeliveryTime)
  @MaxLength(16)
  @MinLength(3)
  deliveryTime: EDeliveryTime;
}
