import { Sequelize } from "sequelize";

// Supports both local MySQL (XAMPP) and Supabase/PostgreSQL
// Switch dialect via DB_DIALECT env var (default: mysql)
const dialect = process.env.DB_DIALECT || 'mysql';

let connection;

if (process.env.DATABASE_URL) {
    // Supabase / any postgres connection string
    connection = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    });
} else {
    // Local MySQL (XAMPP) fallback
    const mysql2 = require('mysql2');
    connection = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            dialectModule: mysql2,
            logging: false,
        }
    );
}

export default connection;