export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db_host: process.env.POSTGRES_HOST,
  db_port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  db_name: process.env.POSTGRES_DB,
  db_user: process.env.POSTGRES_USER,
  db_password: process.env.POSTGRES_PASSWORD,
  jwt_secret: process.env.PRIVATE_KEY,
});
