'use strict';
const fs = require( "fs" );

// if Json file exist, then read multiple accounts 
	let accountsJson = '';
	const Accpath = "./lib/plugins/frontEnd/example/multipleAccounts.json";
	if (fs.existsSync(Accpath))  {
      accountsJson = fs.readJsonSync( Accpath );
	  var Acc_size = Object.keys(accountsJson.Acc).length;
      for(var i = 0; i < Acc_size; i++){
		var accstring = i+1;
		var accountId2 = accountsJson.Acc[''+accstring+''].Id;
		var displayName2 =  accountsJson.Acc[''+accstring+''].DisplayName;
		var accessKeyId2 = accountsJson.Acc[''+accstring+''].AccKeyId;
		var secretAccessKey2 =  accountsJson.Acc[''+accstring+''].AccessKey;		  
	    db.get(accountId2).put({ id: accountId2, displayName: displayName2,});	
		db.get(accessKeyId2).put({ accessKeyId: accessKeyId2, secretAccessKey: secretAccessKey2, });  
		  
	  };
	};	    