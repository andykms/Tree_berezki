import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  Max,
  IsEmail,
} from 'class-validator';

const sexTypes = ['male', 'female', 'not specified'];

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  name: string;

  @IsEnum(sexTypes)
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  sex: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  email: string;
}
