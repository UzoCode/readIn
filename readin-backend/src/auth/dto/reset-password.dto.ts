import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token?: string; // This could be a token sent through another method

  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Minimum length for the new password
  newPassword?: string;
}