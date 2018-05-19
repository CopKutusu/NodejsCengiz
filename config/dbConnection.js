'use strict';

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: '123456',
    database: 'xtbadmin',
});

exports.connection = connection;