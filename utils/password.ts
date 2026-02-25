// Step 7: In concise and short sentences, implement functions for hashing and verifying passwords using the scrypt algorithm from the 'crypto' library. The hashPassword function generates a random salt and hashes the provided password, returning a string that combines the hashed password and the salt. The verifyPassword function takes a stored hash and a supplied password, extracts the hashed password and salt from the stored hash, and compares the hash of the supplied password with the stored hash to determine if they match. This provides a secure way to handle user passwords in the application.
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt); 

export const hashPassword = async (password: string) => {
  const salt = randomBytes(8).toString('hex'); 
  const buf = (await scryptAsync(password, salt, 64)) as Buffer; 
  return `${buf.toString('hex')}.${salt}`;
};

export const comparePassword = async (storedHash: string, suppliedPassword: string) => {
  const [hashed, salt] = storedHash.split('.'); 

  if (!hashed || !salt) {
    throw new Error('Invalid stored hash format');
  }

  const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return buf.toString('hex') === hashed;
};

