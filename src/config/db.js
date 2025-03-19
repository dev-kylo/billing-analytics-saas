const knex = require('knex');
const knexConfig = require('../../knexfile'); // Import knexfile.js

// Initialize knex with the correct environment
const db = knex(knexConfig.development);

module.exports = db;
