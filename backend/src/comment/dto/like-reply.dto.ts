import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LikeReplyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  accountId: string;
}
