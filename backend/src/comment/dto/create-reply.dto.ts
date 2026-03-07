import { MaxLength, MinLength, IsNotEmpty, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  text: string;

  @IsString()
  @MaxLength(255)
  @MinLength(1)
  replyId?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  accountId: string;
}
