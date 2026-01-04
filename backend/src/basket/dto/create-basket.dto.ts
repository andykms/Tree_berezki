import { IsString, MinLength, MaxLength, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateBasketDto {
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

  @IsNumber()
  @Min(1)
  @Max(512)
  quantity: number;
}
