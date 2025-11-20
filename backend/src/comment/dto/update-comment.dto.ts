import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { EHidden } from '../entities/comment.entity';

export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  @IsEnum(EHidden)
  hidden: EHidden;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  accountId: string;
}
