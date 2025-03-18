// Add custom jest matchers
expect.extend({
    // Add any custom matchers here
  });
  
  // Global setup
  beforeAll(() => {
    // Global setup code
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Global cleanup code
    jest.resetModules();
  });

  // Handle unhandled promise rejections in tests
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection in tests:', err);
});