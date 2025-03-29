const knex = require('../config/db');

exports.createRecognitionEntries = async (entries) => knex('revenue_recognition').insert(entries).returning('*');

exports.getBySubscription = (subscriptionId) => knex('revenue_recognition').where({ subscription_id: subscriptionId });
