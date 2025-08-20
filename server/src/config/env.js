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

  ACCESS_KEY: process.env.ACCESS_KEY ?? null,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ?? null,
  AWS_REGION: process.env.AWS_REGION ?? "us-east-1"
};
