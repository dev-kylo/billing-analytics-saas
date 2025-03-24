const setupTestDb = require('./src/utils/setupTestDb');

// Add custom jest matchers
expect.extend({
    // Add any custom matchers here
});

// Global setup
beforeAll(async () => {
    // Global setup code
    jest.clearAllMocks();
    await setupTestDb(); // 👈 boot and reset the test DB
});

afterAll(async () => {
    // Global cleanup code
    jest.resetModules();
    await global.knex.destroy();
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection in tests:', err);
});
