import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsString,
} from 'class-validator';

export enum ESortedCommentBy {
  USEFUL = 'useful',
  OLD = 'old',
  NEW = 'new',
  MAXRATING = 'maxrating',
  MINRATING = 'minrating',
}

export class GetCommentsQueryDto {
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

  @IsOptional()
  @IsString()
  @IsEnum(ESortedCommentBy)
  @MinLength(2)
  @MaxLength(32)
  sortBy: ESortedCommentBy;

  @IsOptional()
  @IsString()
  @IsEnum(['true', 'false'])
  @MinLength(2)
  @MaxLength(16)
  withImage: 'true' | 'false';

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  productId: string;
}
