import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";
import { AuthService } from "./auth.service";

class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() @IsString() name?: string;
}

class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
