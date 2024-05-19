/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const auth = require('./Auth.js');
const account = require('./AccountRoutes.js');
const utils = require('./UtilsRoutes.js');
const profile = require('./ProfileRoutes.js');
const posts = require('./PostsRoutes.js');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(cookieParser());
    app.use(
        auth, 
        account, 
        utils, 
        profile,
        posts
    );
}