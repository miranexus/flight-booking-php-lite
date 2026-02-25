const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: toInt(process.env.DB_PORT, 3306),
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASSWORD || "",
  DB: process.env.DB_NAME || "flight_booking",
  dialect: process.env.DB_DIALECT || "mysql",
  pool: {
    max: toInt(process.env.DB_POOL_MAX, 5),
    min: toInt(process.env.DB_POOL_MIN, 0),
    acquire: toInt(process.env.DB_POOL_ACQUIRE, 30000),
    idle: toInt(process.env.DB_POOL_IDLE, 10000)
  }
};
