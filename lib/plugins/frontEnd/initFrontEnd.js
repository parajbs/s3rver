'use strict';
const debuger2 = require('../tools/debug');
const debuger = new debuger2('debug');	
debuger.fatal('###############  initFrontEnd start ########################');

const Koa = require('koa');
const LocalStrategy = require('passport-local').Strategy;
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const usersRouter = require('./usersauth/usersRouter');
const loginMiddleware = require('./usersauth/login');
const serve = require('koa-static-server');
const S3Error = require('../../models/error');

const initFrontEnd = (app) => {
	app.use(serve({rootDir: './lib/plugins/frontEnd/views/assets', rootPath: '/assets'}));
    // sessions
    app.keys = ['super-secret-key'];
    app.use(session(app));
    // body parser
    app.use(bodyParser());
    app.use(loginMiddleware());
	app.use(passport.initialize());
    app.use(passport.session());			
    // usersRouter 	
    app.use(usersRouter.routes());
};

module.exports = initFrontEnd;
