process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
        polkaKey: envOrThrow("POLKA_KEY"),
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        defaultDuration: 60 * 60, // 1 hour in seconds
        secret: envOrThrow("JWT_SECRET"),
        issuer: "chirpy",
        refreshTokenDuration: 60 * 24 * 60 * 60 * 1000, // 60 days in miliseconds
    },
};
