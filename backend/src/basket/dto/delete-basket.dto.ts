import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class DeleteBasketDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  productId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  accountId: string;
}