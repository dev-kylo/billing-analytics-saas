/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
require('./jobs/checkTrialExpirations'); // loads and starts the cron job

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

module.exports = app;
