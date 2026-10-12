import { IsEmail, IsNotEmpty } from 'class-validator';
export class RegisterAuthDto {
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    username: string;
}
