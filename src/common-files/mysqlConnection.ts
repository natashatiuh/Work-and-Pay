const mysql = require('mysql2/promise');

export const connect = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'kabanchik',
    password: 'root'
})