import { IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  readonly adressId: number;
}
