import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateShowcaseProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  name: string;
}
