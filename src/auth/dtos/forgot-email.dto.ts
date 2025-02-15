import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ForgotPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  newPassword: string;
}
