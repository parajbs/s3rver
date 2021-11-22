'use strict';

const AccountStore = require('../../models/account_db');
const fs = require( "fs" );

const usersAccounts = (app) => {
    app.accounts = new AccountStore();
	  app.accountNumber = 1;
    // create a default account
      app.accounts.addAccount(app.accountNumber, app.defaultAccountId, app.defaultAccountDisplayName, app.defaultAccessKeyId, app.defaultSecretAccessKey);
      app.accounts.addKeyPair(
	    app.accountNumber,
        app.defaultAccountId,
	    app.defaultAccountDisplayName,
        app.defaultAccessKeyId,
        app.defaultSecretAccessKey,
      );
//	};
	
  if ( app.privatebuckets === true ) { 	
	let accountsJson = '';
	const Accpath = "./lib/plugins/frontEnd/example/multipleAccounts.json";
	if (fs.existsSync(Accpath))  {
	  app.accounts.getAccountNumber();
	  app.accountNumber = app.accounts.getAccountNumber() + 1;
      accountsJson = require( "fs-extra" ).readJsonSync( Accpath );
//      accountsJson = require( "fs" ).readFile( Accpath );
	  var Acc_size = Object.keys(accountsJson.Acc).length; 
      for(var i = 0; i < Acc_size; i++){
		var accstring = i+1;
		var accountNumber2 = app.accountNumber;
		var accountId2 = accountsJson.Acc[''+accstring+''].Id;
		var displayName2 = accountsJson.Acc[''+accstring+''].DisplayName;
		var accessKeyId2 = accountsJson.Acc[''+accstring+''].AccKeyId;
		var secretAccessKey2 = accountsJson.Acc[''+accstring+''].AccessKey;
        app.accounts.addAccount(accountNumber2, accountId2,  displayName2, accessKeyId2, secretAccessKey2);
        app.accounts.addKeyPair(
		  accountNumber2,
	      accountId2,
		  displayName2,
          accessKeyId2,
          secretAccessKey2,
        );	
		app.accounts.getAccountNumber(); 
		app.accountNumber = app.accounts.getAccountNumber() + 1;
	  };
	};
  };

};

module.exports = usersAccounts;
