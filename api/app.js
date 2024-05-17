const express = require('express');
const routes = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9000;

routes(app);

app.listen(port, () => {
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;