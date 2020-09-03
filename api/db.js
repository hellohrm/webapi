'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || "db4free.net",
    user: process.env.DB_USER || "hellohrm2020",
    password: process.env.DB_PASSWORD || "toilaty2020x",
    database: process.env.DB_NAME || "hellohrm"
});

module.exports = db
