[13:22, 11/15/2025] Cortouch Media: const mysql = require("mysql2/promise");

exports.handler = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });

    const [rows] = await connection.execute("SELECT 1 AS test");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, rows }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
[13:26, 11/15/2025] Cortouch Media: import mysql from "mysql2/promise";

export const handler = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      port: Number(process.env.DB_PORT),
    });

    const [rows] = await connection.execute("SELECT 1 AS test");

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, rows }),
    };

  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};