require('dotenv').config();

const parseMysqlUrl = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'mysql:' && parsed.protocol !== 'mysql2:') return null;
    const name = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
    if (!parsed.hostname || !parsed.username || !name) return null;
    return {
      host: decodeURIComponent(parsed.hostname),
      port: Number(parsed.port) || 3306,
      name,
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password || ''),
    };
  } catch {
    return null;
  }
};

const fromUrl = parseMysqlUrl(process.env.MYSQL_URL || process.env.DATABASE_URL);

const db = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || fromUrl?.host || '',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || fromUrl?.port) || 3306,
  name: process.env.DB_NAME || process.env.MYSQLDATABASE || fromUrl?.name || '',
  user: process.env.DB_USER || process.env.MYSQLUSER || fromUrl?.user || '',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || fromUrl?.password || '',
};

const required = {
  DB_HOST: db.host,
  DB_NAME: db.name,
  DB_USER: db.user,
  DB_PASSWORD: db.password,
  JWT_SECRET: process.env.JWT_SECRET,
};

for (const [key, value] of Object.entries(required)) {
  if (!value) {
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

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:4200')
  .split(',')
  .map((value) => value.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: clientUrls[0],
  clientUrls,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  db,
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
