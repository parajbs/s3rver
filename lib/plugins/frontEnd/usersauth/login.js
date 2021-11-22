'use strict';
const debuger2 = require('../../tools/debug');
const debuger = new debuger2('debug');	
debuger.fatal('###############  login.js start ########################');

const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;

/**
 * Middleware that ...
 */
module.exports = () =>
  async function login(ctx, next) {

	var records55 = [];
	var records33 = [];	
	const records = [];
	const records2 = [];
	const aKeyid = new Array();
	const pword = new Array();
	const aId = new Array();  
	const dName = new Array();
	const aCreatedDate = new Array();
    var accsize = ctx.app.accounts.getAccountNumber();	
	if (accsize <= 10) {
//      debuger.debug_short('0 accsize0 =  ' + JSON.stringify(  accsize )  + ' \n');	
	  accsize=accsize;
	  for (var i = 0, len = accsize; i < len; i++) {
	    aKeyid[i] = ctx.app.accounts.getaccessKeyId2(i+1);
	    pword[i] = ctx.app.accounts.getSecretAccessKey2(aKeyid[i]);
	    aId[i] = ctx.app.accounts.getaccountId2(i+1);				
	    dName[i] = ctx.app.accounts.getdisplayName2(i+1);
	    aCreatedDate[i] = ctx.app.accounts.getaccountCreatedDate2(i+1);
	    records2[i] = { id: i, username: aKeyid[i], password: pword[i], displayName: dName[i], accountId: aId[i], createdDate: aCreatedDate[i] };
//	      debuger.debug_short('0 records2[i] =  ' + JSON.stringify(  records2[i] )  + ' \n');
	  };	
	} else {
//      debuger.debug_short('0 accsize01 =  ' + JSON.stringify(  accsize )  + ' \n');
	  for (var i = 0, len = 10; i < len; i++) {
	    aKeyid[i] = ctx.app.accounts.getaccessKeyId2(i+1);
	    pword[i] = ctx.app.accounts.getSecretAccessKey2(aKeyid[i]);
	    aId[i] = ctx.app.accounts.getaccountId2(i+1);
	    dName[i] = ctx.app.accounts.getdisplayName2(i+1);
	    aCreatedDate[i] = ctx.app.accounts.getaccountCreatedDate2(i+1);				
	  };
	};
	  
    //############### function buildDB ###################
	var newaccsize = 10;
	const buildDB = async function buildDB() {			
	  for (var i = 0, len = newaccsize; i < len; i++) {
		records[i] = { id: i+1, username: aKeyid[i], password: pword[i], displayName: dName[i], accountId: aId[i], createdDate: aCreatedDate[i] };
	  };	
	};
	buildDB();
//  	      debuger.debug_short('0 records =  ' + JSON.stringify(  records )  + ' \n');

    //############### function findById ###################	
    const findById = function(id, cb) {
      (async () => {		
	    records55 = await ctx.app.records;
      })();	 
      process.nextTick(function() {
		var idx = id - 1; 
//		var idx = id ; 		  
        if (records55[idx]) {
//          debuger.debug_short('0 records[idx] =  ' + JSON.stringify(  records55[idx] )    + ' \n');			
          cb(null, records55[idx]);
        } else {
          cb(new Error('User ' + id + ' does not exist'));
        }

      });
    }
	
    //############### function findByUsername ###################	
    const findByUsername = function(username, cb) {
//	    debuger.debug_short('0 username =  ' + username  + ' \n');
	  var accsize2 = ctx.app.accounts.getAccountNumber();	
//	  records55 = records;
		records55 = ctx.app.records;
      process.nextTick(function() {
 //       debuger.debug_short('0 records.length =  ' + records55.length  + ' \n');	
        for (var i = 0, len = records55.length; i < len; i++) {  
          var record = records55[i];			
          if (record.username === username) {
            return cb(null, record);
          }
        }
        return cb(null, null);
      });
    }		

    //############### passport ###################	
    passport.use(new LocalStrategy(function (username, password, done) {
	  findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false); }
 //       debuger.debug_short('0 findByUsername =  ' + JSON.stringify(  user )  + ' \n');
        return done(null, user);
      });
    }));

    passport.serializeUser(function(user, done) {
 //     debuger.debug_short('0 serializeUser =  ' + JSON.stringify(  user.id )  + ' \n');
      done(null, user.id);
    });

   passport.deserializeUser(async function(id, done) {
     findById(id, function (err, user) {
       if (err) { return done(err); }	  
       done(null, user);
//	     debuger.debug_short('0 deserializeUser =  ' + JSON.stringify(  user )  + ' \n');		 
     });	
   });
	
  return await next();
};
