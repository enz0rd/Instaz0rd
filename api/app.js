// eslint-disable-next-line no-undef
const express = require('express');
const routes = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = 9000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;