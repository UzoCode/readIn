import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token?: string; // This property is Optional

  @IsString()
  newPassword?: string; // This property is Optional
}