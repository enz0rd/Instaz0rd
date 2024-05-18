/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const bodyParser = require('body-parser');
const auth = require('./Auth.js');
const account = require('./AccountRoutes.js');
const utils = require('./UtilsRoutes.js');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(auth, account, utils);
    app.use(bodyParser.urlencoded({ extended: true }));
}