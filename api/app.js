// eslint-disable-next-line no-undef
const express = require('express');
const routes = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 9000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000}));

routes(app);

app.listen(port, () => {
  console.clear();
  console.log(`\x1b[32m# Server started! \x1b[0m`);
  console.log(`\x1b[34m Running on: \x1b[0m`);
  console.log(`\x1b[33m 
    Link: http://localhost:${port} \n
    Date: ${new Date().toLocaleDateString()} 
    \x1b[0m`);
  console.log(`\x1b[42m           
 Enjoy!    
 By enz0rd 
           \x1b[0m`,);
  
});

module.exports = app;