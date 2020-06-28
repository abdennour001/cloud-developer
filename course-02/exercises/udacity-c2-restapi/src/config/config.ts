require("dotenv").config();

export const config = {
    dev: {
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: process.env.POSTGRES_DIALECT,
        aws_region: process.env.POSTGRES_AWS_REGION,
        aws_profile: process.env.POSTGRES_AWS_PROFILE,
        aws_media_bucket: process.env.POSTGRES_AWS_MEDIA_BUCKET
    },
    prod: {
        username: "udagramamokrane",
        password: "Abdou123",
        database: "udagram_prod",
        host: "udagramamokrane.cmuksxu17fap.us-east-2.rds.amazonaws.com",
        dialect: "postgres"
    }
};
