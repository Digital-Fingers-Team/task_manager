import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  clientOrigin: string;
  nodeEnv: string;
}

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value ?? "5000");

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  return parsed;
};

export const env: EnvConfig = {
  port: parsePort(process.env.PORT),
  mongodbUri: requiredEnv("MONGODB_URI"),
  jwtSecret: requiredEnv("JWT_SECRET"),
  clientOrigin: process.env.CLIENT_ORIGIN?.trim() || "*",
  nodeEnv: process.env.NODE_ENV?.trim() || "development"
};
