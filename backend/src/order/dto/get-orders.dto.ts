import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GetOrdersQueryDto {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(32)
  @MinLength(1)
  page: string;

  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(32)
  @MinLength(1)
  limit: string;
}
