const request = require('supertest');
const app = require('../app'); // Express app

describe('Customer CRUD', () => {
    test('should create a customer and persist it to the DB', async () => {
        const res = await request(app).post('/customers').send({
            firstname: 'Gandalf',
            surname: 'TheWhite',
            email: 'gandalf@lotr.com',
        });

        expect(res.statusCode).toBe(202);
        expect(res.body[0]).toHaveProperty('id');
        const { id } = res.body[0];

        const customer = await global.knex('customers').where({ id }).first();
        expect(customer).toBeDefined();
        expect(customer.email).toBe('gandalf@lotr.com');
    });
});
