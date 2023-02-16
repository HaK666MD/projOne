import { IsNotEmpty } from 'class-validator';

export class AdressDto {
  @IsNotEmpty()
  readonly street: string;

  @IsNotEmpty()
  readonly city: string;

  @IsNotEmpty()
  readonly country: string;
}
