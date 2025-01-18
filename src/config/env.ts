import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    APP_ENV: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    // MONGODB_AUTH_SOURCE: string;
    DATABASE_AUTH_URL: string;
    NATS_URL: string;
    NATS_PORT: number;
}

export const envSchema = joi.object({
    PORT: joi.number().required(),
    APP_ENV: joi.string().required(),
    POSTGRES_HOST: joi.string().required(),
    POSTGRES_PORT: joi.string().optional().default(5432),
    POSTGRES_USER: joi.string().required(),
    POSTGRES_PASSWORD: joi.string().required(),
    POSTGRES_DB: joi.string().required(),
    // MONGODB_AUTH_SOURCE: joi.string().required(),
    DATABASE_AUTH_URL: joi.string().required(),
    NATS_URL: joi.string().required(),
    NATS_PORT: joi.number().required(),
}).unknown(true);

const { error, value } = envSchema.validate( process.env );

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    APP_ENV: envVars.APP_ENV,
    DATABASE_AUTH_URL: envVars.DATABASE_AUTH_URL,
    POSTGRES_HOST: envVars.POSTGRES_HOST,
    POSTGRES_PORT: envVars.POSTGRES_PORT,
    POSTGRES_USER: envVars.POSTGRES_USER,
    POSTGRES_PASSWORD: envVars.POSTGRES_PASSWORD,
    POSTGRES_DB: envVars.POSTGRES_DB,
    // MONGODB_AUTH_SOURCE: envVars.MONGODB_AUTH_SOURCE,
    NATS_URL: envVars.NATS_URL,
    NATS_PORT: envVars.NATS_PORT,
}