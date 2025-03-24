/* eslint-disable import/no-extraneous-dependencies */
const app = require('./app');

const PORT = process.env.PORT || 2222;

app.listen(PORT, () => {
    console.log(`SaaS Application Running On Port ${PORT}`);
});
