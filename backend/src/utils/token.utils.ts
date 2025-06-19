import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Generates a JWT token with the provided payload, secret, and expiration time.
 */
export function generateToken(payload: string | object | Buffer, secret: string, expiresIn: string): string {
  const options: SignOptions = { expiresIn: expiresIn as SignOptions["expiresIn"] };
  console.log(payload,"token payeload");
  
  return jwt.sign(payload, secret, options);
}
