import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  APP_ENV: string;
  HOST: string;
  PORT: number;
  FRONTEND_URL: string;

  DATABASE_AUTH_URL: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  MONGODB_AUTH_SOURCE: string;

  JWT_SECRET: string;

  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASSWORD: string;

  NATS_URL: string;
  NATS_PORT: number;
}

export const envSchema = joi
  .object({
    APP_ENV: joi.string().required(),
    HOST: joi.string().required(),
    PORT: joi.number().required(),
    FRONTEND_URL: joi.string().required(),

    DATABASE_AUTH_URL: joi.string().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_PORT: joi.string().optional().default(5432),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    MONGODB_AUTH_SOURCE: joi.string().required(),

    JWT_SECRET: joi.string().required(),

    MAIL_HOST: joi.string().required(),
    MAIL_PORT: joi.number().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),

    NATS_URL: joi.string().required(),
    NATS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  // *configuraciones basicas
  APP_ENV: envVars.APP_ENV,
  HOST: envVars.HOST,
  PORT: envVars.PORT,
  FRONTEND_URL: envVars.FRONTEND_URL,
  // *DATABASE
  DATABASE_AUTH_URL: envVars.DATABASE_AUTH_URL,
  POSTGRES_HOST: envVars.POSTGRES_HOST,
  POSTGRES_PORT: envVars.POSTGRES_PORT,
  POSTGRES_USER: envVars.POSTGRES_USER,
  POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD,
  POSTGRES_DB: envVars.POSTGRES_DB,
  MONGODB_AUTH_SOURCE: envVars.MONGODB_AUTH_SOURCE,
  // *Keys
  JWT_SECRET: envVars.JWT_SECRET,
  // *MAILS
  MAIL_HOST: envVars.MAIL_HOST,
  MAIL_PORT: envVars.MAIL_PORT,
  MAIL_USER: envVars.MAIL_USER,
  MAIL_PASSWORD: envVars.MAIL_PASSWORD,
  // *REDIS
  // *NATS
  NATS_URL: envVars.NATS_URL,
  NATS_PORT: envVars.NATS_PORT,
};
