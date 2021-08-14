import { object, string } from 'joi';

const MINPWD = 6;

export const RegisterValidator = object({
  username: string().required(),
  email: string().email().required(),
  password: string().min(MINPWD).required()
});

export const LoginValidator = object({
  username: string().required(),
  password: string().min(MINPWD).required()
});

export const UpdateValidator = object({
  username: string(),
  email: string().email(),
  password: string().min(6)
});