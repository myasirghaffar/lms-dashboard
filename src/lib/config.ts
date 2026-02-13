// Environment variables configuration
export const env = {
    DATABASE_URL: process.env.DATABASE_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',

    // SMS Configuration (for attendance alerts)
    SMS_API_KEY: process.env.SMS_API_KEY || '',
    SMS_SENDER_ID: process.env.SMS_SENDER_ID || '',

    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL_PORT: process.env.EMAIL_PORT || '587',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
    EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@schoollms.com',

    // App Configuration
    APP_NAME: process.env.APP_NAME || 'School LMS',
    APP_URL: process.env.APP_URL || 'http://localhost:3000',

    // Node Environment
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
