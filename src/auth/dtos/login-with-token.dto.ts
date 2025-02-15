import { IsJWT, IsNotEmpty, IsString } from "class-validator";


export class LoginWithTokenDto {
  @IsString()
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
