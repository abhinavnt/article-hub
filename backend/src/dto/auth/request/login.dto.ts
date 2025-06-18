export class LoginDto {
  identifier: string;
  password: string;

  constructor(data: any) {
    if (!data.identifier || !data.password) {
      throw new Error("Missing required fields");
    }
    this.identifier = data.identifier;
    this.password = data.password;
  }
}