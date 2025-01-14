import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    MONGODB_AUTH_SOURCE: string;
}

export const envSchema = joi.object({
    PORT: joi.number().required(),
    MONGODB_AUTH_SOURCE: joi.string().required(),
    // define more env vars here
}).unknown(true); // unknown(true) es para permitir variables de entorno no definidas en el schema

const { error, value } = envSchema.validate( process.env );

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    MONGODB_AUTH_SOURCE: envVars.MONGODB_AUTH_SOURCE,
    // Add more env vars here
}