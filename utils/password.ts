// Step 7: In concise and short sentences, implement functions for hashing and verifying passwords using the scrypt algorithm from the 'crypto' library. The hashPassword function generates a random salt and hashes the provided password, returning a string that combines the hashed password and the salt. The verifyPassword function takes a stored hash and a supplied password, extracts the hashed password and salt from the stored hash, and compares the hash of the supplied password with the stored hash to determine if they match. This provides a secure way to handle user passwords in the application.
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt); // This converts the scrypt function, which uses a callback, into a version that returns a Promise, allowing us to use async/await syntax for better readability and error handling when hashing passwords.

export const hashPassword = async (password: string) => {
  const salt = randomBytes(8).toString('hex'); // What is salt and randomBytes(8) and hex? A salt is a random string added to a password before hashing to enhance security by making it more resistant to attacks. randomBytes(8) generates 8 random bytes, which are then converted to a hexadecimal string using toString('hex'), resulting in a 16-character salt.
  const buf = (await scryptAsync(password, salt, 64)) as Buffer; // What is scryptAsync and 64? scryptAsync is the promisified version of the scrypt function, which is used to hash the password. The number 64 specifies the length of the derived key (hash) in bytes, meaning that the resulting hash will be 64 bytes long (128 characters in hexadecimal). What is Buffer? Buffer is a class in Node.js that represents a fixed-size chunk of memory, often used to handle binary data. In this case, it is used to store the result of the scrypt hashing function, which produces a binary hash that can be converted to a hexadecimal string for storage.
  return `${buf.toString('hex')}.${salt}`;
};

export const comparePassword = async (storedHash: string, suppliedPassword: string) => {
  const [hashed, salt] = storedHash.split('.'); // This splits the stored hash string into two parts: the hashed password and the salt, using the period (.) as a delimiter. The hashed password is the first part (before the period), and the salt is the second part (after the period). This allows us to retrieve both components needed for verifying the supplied password.

  if (!hashed || !salt) {
    throw new Error('Invalid stored hash format');
  }

  const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
  return buf.toString('hex') === hashed;
};

