import { MaxLength, MinLength, IsNotEmpty } from "class-validator";


export class CreateQuestionDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  request: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  productId: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  accountId: string;
}
