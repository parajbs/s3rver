'use strict';
const debuger2 = require('../../tools/debug');
const debuger = new debuger2('debug');	
debuger.fatal('###############  usersRouter start ########################');

const S3Error = require('../../../models/error');
//const bucketCtrl = require('../../../controllers/bucket');
//const objectCtrl = require('../controllers/object');
//const serviceCtrl = require('../controllers/service');
//const iamCtrl = require('../../../controllers/iam');
const { utf8BodyParser, xmlBodyParser } = require('../../../utils');

const Router = require('@koa/router');
//const auth = require( 'koa-basic-auth' );
const passport = require('koa-passport');
const request = require('request');
const fs = require('fs');
var crypto = require('crypto');

const usersRouter = new Router();

function checkIfLogin(ctx) {
	const resultLogin = passport.authenticate('local', );
	return resultLogin;  
   if (ctx.isAuthenticated()) {
  } else {
  };
};


const queryMethod = (methods) =>
  async function queryMethod(ctx, next) {	
    const matchedMethods = methods.filter((method) => method in ctx.query);
    if (matchedMethods.length > 1) {
      throw new S3Error(
        'InvalidArgument',
        `Conflicting query string parameters: ${matchedMethods.join(', ')}`,
        {
          ArgumentName: 'ResourceType',
          ArgumentValue: matchedMethods[0],
        },
      );
    }
    if (matchedMethods.length === 1) {
      ctx.params.queryMethod = matchedMethods[0];
    }
    await next();
    if (ctx.state.methodIsNotAllowed) {
      throw new S3Error(
        'MethodNotAllowed',
        'The specified method is not allowed against this resource.',
        {
          Method: ctx.method.toUpperCase(),
          ResourceType: ctx.params.queryMethod.toUpperCase(),
        },
      );
    }
  };


//########

usersRouter.get('/users', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./lib/plugins/frontEnd/views/welcome.html');
})


//########

usersRouter.get('/userslogin', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./lib/plugins/frontEnd/views/login.html');
})


//########

usersRouter.post('/login', async (ctx,next) => {
  utf8BodyParser(ctx); 
  var req_webtokenkey = ctx.request.body['webtokenkey'];	
//  debuger.debug_short('00333 req_webtokenkey =  ' +  JSON.stringify( req_webtokenkey ) + ' \n');
  if (req_webtokenkey === '1111') {
    return passport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/userslogin'
    })(ctx, next);	
  } else {
	ctx.logout();
    ctx.redirect('/userslogin');	
  };	  
})	


//########

usersRouter.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/userslogin');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})


//########

usersRouter.get('/app', async (ctx) => {
	if (ctx.isAuthenticated()) {
      ctx.redirect('/webconsole');
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
})



//########

usersRouter.get('/webconsole', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.type = 'html';	
      var app2 = fs.createReadStream('./lib/plugins/frontEnd/views/app2.html');
	  ctx.body = app2;
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
})



//########

usersRouter.post('/createuser', async (ctx) => {
    if (ctx.isAuthenticated()) {
	  var accountNumber = ctx.app.accounts.getAccountNumber();	  
	  utf8BodyParser(ctx);
	  if (accountNumber <= 9) {  
        var req_username = ctx.request.body['UserName'];
        var req_accountId = ctx.request.body['accountId'];
        var req_accessKeyId = ctx.request.body['accessKeyId'];	  
        var req_secretAccessKey = ctx.request.body['secretAccessKey'];
        accountNumber = accountNumber + 1;	  

	    ctx.app.accounts.addAccount(accountNumber, req_accountId, req_username, req_accessKeyId, req_secretAccessKey);
        ctx.app.accounts.addKeyPair(
	         accountNumber,
             req_accountId,
	         req_username,
             req_accessKeyId,
             req_secretAccessKey,
        );	  
        ctx.body = { "createuser_success": "User "+ctx.request.body['UserName']+" created!" };
	  } else {
	    ctx.body = { createuser_success: "Disabled! 10/10 Accounts!" }; 
	  };
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
})



//########

usersRouter.post('/checkaccsize', async (ctx) => {
    if (ctx.isAuthenticated()) {	  
      var accountNumber2 = ctx.app.accounts.getAccountNumber();	  
	  ctx.body = { "checkaccsize_success": accountNumber2 };  	  
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
})



//########

usersRouter.post('/getwebtokenkeyhash',	async (ctx) => { 	
      const webtokenkeydata = '{ "webtokenkey": "1111" }';		

	  const ENC_KEY2 = "6fa979f20126cb08aa645a8f495f6d85";
      const IV2 = "I8zyA4lVhMCaJ5Kg"; 
      const phrase4 = webtokenkeydata;
		
      var encrypt2 = function (val2) {
        let cipher2 = crypto.createCipheriv('aes-256-cbc', ENC_KEY2, IV2);
        let encrypted2 = cipher2.update(val2, 'utf8', 'base64');
        encrypted2 += cipher2.final('base64');
  	    return encrypted2;
      };

      var encrypted_key2 = encrypt2(phrase4);	
//      debuger.debug_short('00000881ddd encrypted_key =  ' +  encrypted_key2 + ' \n');	
      var trans4 = btoa(phrase4); 	
	  ctx.body = { "getwebtokenkeyhash_success": trans4 };	
})	



//########

usersRouter.post('/getprofileinfo', async (ctx) => {
    if (ctx.isAuthenticated()) {
	  const user2 = await ctx.state.user;
//      debuger.debug_short('00000881ddd user2 =  ' +  JSON.stringify( user2 ) + ' \n');		
      const profileinfodata = '{ "id": "'+user2.id+'", "username": "'+user2.username+'", "password": "'+user2.password+'", "displayName": "'+user2.displayName+'", "accountId": "'+user2.accountId+'", "createdDate": "'+user2.createdDate+'" }';		

	  const ENC_KEY2 = "6fa979f20126cb08aa645a8f495f6d85";
      const IV2 = "I8zyA4lVhMCaJ5Kg"; 
      const phrase2 = profileinfodata;
		
      var encrypt2 = function (val2) {
        let cipher2 = crypto.createCipheriv('aes-256-cbc', ENC_KEY2, IV2);
        let encrypted2 = cipher2.update(val2, 'utf8', 'base64');
        encrypted2 += cipher2.final('base64');
  	    return encrypted2;
      };

//      var decrypt2 = function (encrypted2) {
//        let decipher2 = crypto.createDecipheriv('aes-256-cbc', ENC_KEY2, IV2);
//        let decrypted2 = decipher2.update(encrypted2, 'base64', 'utf8');
//        return (decrypted2 + decipher2.final('utf8'));
//      };
		
      var encrypted_key2 = encrypt2(phrase2);
//      debuger.debug_short('00000881ddd encrypted_key =  ' +  encrypted_key2 + ' \n');	
      var trans2 = btoa(encrypted_key2);  
	  ctx.body = { "getprofileinfo_success": trans2 };	
		
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
})



//########

usersRouter.get('/s3explorer', async (ctx) => {
    if (ctx.isAuthenticated()) {
      ctx.type = 'html';
      ctx.body = fs.createReadStream('./lib/plugins/frontEnd/views/explorer3.html');
    } else {
      ctx.body = { success: false };
      ctx.throw(401);
    }
});



//##############################

module.exports = usersRouter;
