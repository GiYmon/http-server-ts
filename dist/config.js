process.loadEnvFile();
export const config = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL"),
};
function envOrThrow(envVar) {
    const value = process.env[envVar];
    if (!value) {
        throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
}
