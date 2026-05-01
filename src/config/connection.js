import { Sequelize } from "sequelize";

// Connection is created lazily inside a function to avoid top-level await
let _connection = null;

function getConnection() {
    if (_connection) return _connection;

    if (process.env.DATABASE_URL) {
        // Supabase / PostgreSQL (production on Vercel)
        _connection = new Sequelize(process.env.DATABASE_URL, {
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
        // Local MySQL fallback (XAMPP development)
        const mysql2 = require('mysql2');
        _connection = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS ?? '',
            {
                host: process.env.DB_HOST,
                dialect: 'mysql',
                dialectModule: mysql2,
                logging: false,
            }
        );
    }

    return _connection;
}

// Export a Proxy so models can use `connection.define(...)` directly
// while connection is still lazily initialized
const connection = new Proxy({}, {
    get(_, prop) {
        return getConnection()[prop];
    }
});

export default connection;