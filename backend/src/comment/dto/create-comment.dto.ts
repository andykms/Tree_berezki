import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  Max,
  Min,
  IsEnum,
} from 'class-validator';
import { EHidden } from '../entities/comment.entity';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(0)
  advantage: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(0)
  disadvantage: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  @MinLength(0)
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @IsNotEmpty()
  @IsEnum(EHidden)
  @MaxLength(16)
  @MinLength(2)
  hidden: EHidden;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  productId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  accountId: string;
}
