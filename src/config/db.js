const knex = require('knex');
const knexConfig = require('../../knexfile'); // Import knexfile.js

const env = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[env]);

module.exports = db;
