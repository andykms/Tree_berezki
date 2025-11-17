import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';

const maxPhoneLen = '+7-(999)-999-99-99'.length;

export class CreateShopDto {
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  organization: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(12)
  INN: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(13)
  OGRN: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(128)
  country: string;

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
