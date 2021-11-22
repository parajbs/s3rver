'use strict';

const webUsers = (app) => { 
	app.records3 = [];
	app.use(async (ctx, next) => {
	  app.recordsAll = ctx.app.accounts.getAllUsers();	  
		  for (var i = 0, len = 10; i < len; i++) {
		    if (app.recordsAll[i] != null) { 
		      app.records3[i] = { id: app.recordsAll[i].id, username: app.recordsAll[i].username, password: app.recordsAll[i].password, displayName: app.recordsAll[i].displayName, accountId: app.recordsAll[i].accountId, createdDate: app.recordsAll[i].createdDate };		  
	        };
		  };
	  app.records = app.records3;	
      return await next();
    });	  	
};

module.exports = webUsers;
