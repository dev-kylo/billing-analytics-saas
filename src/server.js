const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 2222;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`SaaS Application Running On Port ${PORT}`);
});


