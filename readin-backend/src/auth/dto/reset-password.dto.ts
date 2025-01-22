import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6) // Minimum length for the new password
  newPassword?: string;
}