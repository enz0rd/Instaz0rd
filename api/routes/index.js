const bodyParser = require('body-parser');
const auth = require('./Auth.js');
const account = require('./AccountRoutes.js');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(auth, account);
    app.use(bodyParser.urlencoded({ extended: true }));
}