export class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
}

export class LoginDto {
  username!: string;
  password!: string;
}

export class UpdateDto {
  username?: string;
  email?: string;
  password?: string;
}

export class CreateRoomDto {
  name!: string;
}