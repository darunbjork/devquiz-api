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

