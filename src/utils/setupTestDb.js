const db = require('../config/db');

module.exports = async () => {
    // Run all migrations
    await db.migrate.rollback(undefined, true); // Clean slate
    await db.migrate.latest();

    // Optional: seed base data here if needed
    // await knex('customers').insert({ name: 'Test Co', email: 'test@example.com' });

    // Attach to global for access in tests
    console.log('setupTestDb');
    global.knex = db;
};
