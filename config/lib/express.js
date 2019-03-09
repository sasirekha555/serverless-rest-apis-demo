'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const expressJwt = require('express-jwt');
const consolidate = require('consolidate');
const winston = require('winston');
const logger = require('logops');
const expressLogging = require('express-logging');

const constants = require('../constants');
const config = require('../config');
const routesV1_0 = require('../routes/routes_v1.0');
//import utils from '../../common/utils';

const MongoStore = connectMongo(session);

/**
 * Initialize application middleware
 */

function initMiddleware(app) {
    // Showing stack errors
    app.set('showStackError', true);

    // Enable jsonp
    app.enable('jsonp callback');

    // Should be placed before express.static
    app.use(compress({
        filter: function(req, res) {
            return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Request body parsing middleware should be above methodOverride
    /*app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());*/
    app.set('view engine', 'ejs');
    app.use(bodyParser.json({ limit: '100mb' }));
    app.use(bodyParser.urlencoded({
         limit: '100mb',
         parameterLimit: 100000000,
         extended: true //extended: true
     })); 
    app.use(methodOverride());

    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    //app.use('/',)
    app.use('/apidocs', express.static('apidocs'));
    app.use(cors());
    app.use(express.static('public'));
    app.get('/',function(req,res){
        //res.render('index');
        res.send("Welcome!"+process.env.NODE_ENV);
    });
    app.get('/file',function(req,res){
        res.render('file');
    });
}


// //Provide different secrets for admin and product routes
// const getJwtSecret = function (req, payload, done) {
//   if (req.originalUrl.indexOf('/v1/admin') > -1) {
//     done(null, config.jwt.adminSecret);
//   } else {
//     done(null, config.jwt.secret);
//   }
// };

/**
 * Initialize express-jwt middleware to verify jwt tokens for each and every route
 */
function initJwtMiddleware(app) {
    // let allowedRoutes = ['/', '/index', '/features', '/aboutus', '/contactus', '/appsinfo', /^\/appsinfo\/.*/];

    // app.use(expressJwt({secret: config.default.jwt.secret}).unless({path: allowedRoutes}));

    // app.use(function (err, req, res, next) {

    //   if (err.name === 'UnauthorizedError') {
    //     res.status(401).json({
    //       status: 'unauthorized',
    //       message: 'You are not authorized to access',
    //       errors: {
    //         message: 'Invalid token'
    //       }
    //     });
    //   }
    // });

    //app.use(utils.checkForJWT);
}

/**
 * Configure Express session
 */
function initSession(app, db) {
    // Express MongoDB session storage
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        cookie: {
            maxAge: config.sessionCookie.maxAge,
            httpOnly: config.sessionCookie.httpOnly,
            secure: config.sessionCookie.secure && config.secure.ssl
        },
        key: config.sessionKey,
        store: new MongoStore({
            mongooseConnection: db.connection,
            collection: config.sessionCollection
        })
    }));
}

/**
 * Configure the modules ACL policies
 */
function initModulesPolicies(app) {
    // Globbing policy files
    config.files.policies.forEach(function(policyPath) {
        require(path.resolve(policyPath)).invokeRolesPolicies();
    });
}

/**
 * Configure the modules server routes
 */
function initModulesRoutes(app) {
    // Globbing routing files
    // config.files.routes.forEach(function (routePath) {
    //   require(path.resolve(routePath))(app);
    // });
    app.use(routesV1_0);

}

/**
 * Configure Helmet headers configuration
 */
function initHelmetHeaders(app) {
    // Use helmet to secure Express headers
    let SIX_MONTHS = 15778476000;
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.use(helmet.hsts({
        maxAge: SIX_MONTHS,
        includeSubdomains: true,
        force: true
    }));
    app.disable('x-powered-by');
}

/**
 * Configure Cors module to allow specific domains
 */

function handleCors(app) {
    let whitelist = ['http://localhost:3000'];

    let corsOptions = {
        origin: function(origin, callback) {
            let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
            callback(null, originIsWhitelisted);
        }
    };

    app.use(cors(corsOptions));
}

/**
 * Initialize the Express application
 */
module.exports = function init(db) {
    // Initialize express app
    let app = express();

    app.use(expressLogging(logger));
    app.enable('trust proxy');

    // Initialize middlewares
    initMiddleware(app);

    // Initialize session config
    //initSession(app, db);

    // Initialize helmet
    // initHelmetHeaders(app);

    // Enable and handle cors
    // handleCors(app);

    // Initialize middlewares
    //initJwtMiddleware(app);

    // Initialize application module config files
    // initModulesConfiguration(app, db);

    // Initialize modules server authorization policies
    // initModulesPolicies(app);

    // Initialize modules server routes
    initModulesRoutes(app);

    winston.loggers.add('platform-core', {
        console: config.winston.console,
        file: config.winston.file
    });

    winston.loggers.get('platform-core');

    return app;
}
