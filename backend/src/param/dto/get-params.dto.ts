import {
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class GetParamsQueryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  page: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @IsNumberString()
  limit: string;
}
