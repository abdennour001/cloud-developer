import { config } from "./config/config";
import { Sequelize } from "sequelize-typescript";

const c = config.dev.postgres;

// Instantiate new Sequelize instance!
const sequelize = new Sequelize({
    username: c.username,
    password: c.password,
    database: c.database,
    host: c.host,
    port: +c.port,

    dialect: "postgres",
    storage: ":memory:"
});

export default sequelize;
