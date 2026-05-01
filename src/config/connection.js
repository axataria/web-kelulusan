import { Sequelize } from "sequelize";

let connection;

if (process.env.DATABASE_URL) {
    // Supabase / PostgreSQL (production on Vercel)
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
    // Local MySQL fallback (XAMPP development)
    const { default: mysql2 } = await import('mysql2');
    connection = new Sequelize(
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

export default connection;