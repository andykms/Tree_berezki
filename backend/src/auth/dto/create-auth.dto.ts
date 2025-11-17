import {
  IsPhoneNumber,
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';

const maxPhoneLen = '+7-(999)-999-99-99'.length;

export class CreateAuthDto {
  @IsPhoneNumber()
  @IsString()
  @MinLength(11)
  @MaxLength(maxPhoneLen)
  @IsNotEmpty()
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(4096)
  @IsNotEmpty()
  password: string;
}
