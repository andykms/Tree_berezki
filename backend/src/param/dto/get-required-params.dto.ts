import {
  IsString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class GetRequiredParamsQueryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  categoryId: string;
}
