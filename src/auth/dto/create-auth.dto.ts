import { IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength,  } from "class-validator";

export class CreateAuthDto {

    @IsNumber()
    @IsOptional()
    rol_id?: number;

    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsString()
    nickname: string;

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
    password: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsString()
    city: string;
}
