import { IsEmail, IsJWT, IsNumber, IsString } from "class-validator";


export class RefreshTokenDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  id: number;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  nickname: string;
}
