export interface EnvConfig {
  VITE_API_URL: string;
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_KEY: string;
}

declare global {
  interface Window {
    ENV?: EnvConfig;
  }
}

const getEnvVar = (key: keyof EnvConfig, defaultValue: string = ""): string => {
  if (window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  return import.meta.env[key] || defaultValue;
};

export const config = {
  VITE_API_URL: getEnvVar("VITE_API_URL", "http://localhost:3000ealaamrea"),
  VITE_SUPABASE_URL: getEnvVar("VITE_SUPABASE_URL"),
  VITE_SUPABASE_KEY: getEnvVar("VITE_SUPABASE_KEY"),
};
