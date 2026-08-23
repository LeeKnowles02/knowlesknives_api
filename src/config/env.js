require('dotenv').config();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

if (process.env.JWT_SECRET.length < 16) {
  console.error('JWT_SECRET must be at least 16 characters');
  process.exit(1);
}

const parseCloudinaryUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'cloudinary:') return null;
    if (!parsed.username || !parsed.password || !parsed.hostname) return null;
    return {
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
      cloudName: parsed.hostname,
    };
  } catch {
    return null;
  }
};

const cloudinaryCredentials = parseCloudinaryUrl(process.env.CLOUDINARY_URL);

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4200',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@knowlesknives.co.za',
    password: process.env.ADMIN_PASSWORD || 'Admin123!',
  },
  cloudinary: {
    url: process.env.CLOUDINARY_URL || '',
    cloudName: cloudinaryCredentials?.cloudName || '',
    apiKey: cloudinaryCredentials?.apiKey || '',
    apiSecret: cloudinaryCredentials?.apiSecret || '',
    get isConfigured() {
      return Boolean(cloudinaryCredentials);
    },
  },
};

module.exports = env;
