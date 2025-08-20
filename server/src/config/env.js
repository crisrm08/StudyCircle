import "dotenv/config";

const required = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`[ENV] Falta variable: ${name}`);
  process.env[name] = v;
  return v;
};

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? "5000"),

  SUPABASE_URL: required("SUPABASE_URL"),
  SERVICE_ROLE_KEY: required("SERVICE_ROLE_KEY"),

  ACCESS_KEY: required("ACCESS_KEY"),
  SECRET_ACCESS_KEY: required("SECRET_ACCESS_KEY"),
  AWS_REGION: process.env.AWS_REGION ?? "us-east-1"
};
