import {
  IsNotEmpty,
  IsNumberString,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class GetBasketQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(1)
  @MaxLength(16)
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(1)
  @MaxLength(16)
  limit: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  accountId: string;
}
