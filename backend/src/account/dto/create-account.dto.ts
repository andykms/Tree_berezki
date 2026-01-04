import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { sexTypes } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  name: string;

  @IsEnum(sexTypes)
  @IsNotEmpty()
  sex: sexTypes;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  email: string;
}
