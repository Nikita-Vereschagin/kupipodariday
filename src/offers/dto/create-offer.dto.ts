import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class CreateOfferDto {

  @IsNumber()
  @Min(1)
  amount: number;

  @IsNumber()
  itemId: number;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
