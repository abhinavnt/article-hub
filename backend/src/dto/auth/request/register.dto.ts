export class RegisterDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  passwordConfirmation: string;
  articlePreferences: string[];

  constructor(data: any) {
    if (!data.firstName || !data.lastName || !data.phone || !data.email || !data.dateOfBirth || !data.password || !data.passwordConfirmation) {
      throw new Error("Missing required fields");
    }
    if (data.password !== data.passwordConfirmation) {
      throw new Error("Passwords do not match");
    }
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.email = data.email;
    this.dateOfBirth = data.dateOfBirth;
    this.password = data.password;
    this.passwordConfirmation = data.passwordConfirmation;
    this.articlePreferences = data.articlePreferences || [];
  }
}