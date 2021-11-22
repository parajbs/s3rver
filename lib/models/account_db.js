'use strict';

const debuger2 = require('../plugins/tools/debug');
const debuger = new debuger2('debug');	
debuger.fatal('###############  account start ########################');
var Gun = require('gun'); // in NodeJS
//var gun = Gun({ file: 'lib/models/db', radisk: true, localStorage: false });
// basic in-memory storage abstraction for accounts and AWS credential key pairs

class Account {
  constructor(num, id, displayName, accessKeyId) {
    Object.assign(this, { num, id, displayName, accessKeyId });
    this.secretAccessKeys = new Map();
  }

  assignKeyPair(accessKeyId, secretAccessKey) {
    this.secretAccessKeys.set(accessKeyId, secretAccessKey);
  }

  getSecretAccessKey(accessKeyId) {
    return this.secretAccessKeys.get(accessKeyId);
  }

  deleteKeyPair(accessKeyId) {
    this.secretAccessKeys.delete(accessKeyId);
  }
}


class AccountWeb {
  constructor(id, username, password, displayName, accountId, createdDate) {
    Object.assign(this, { id, username, password, displayName, accountId, createdDate });
    this.secretAccessKeys = new Map();
  }

  assignKeyPair(accessKeyId, secretAccessKey) {
    this.secretAccessKeys.set(accessKeyId, secretAccessKey);
  }

  getSecretAccessKey(accessKeyId) {
    return this.secretAccessKeys.get(accessKeyId);
  }

  deleteKeyPair(accessKeyId) {
    this.secretAccessKeys.delete(accessKeyId);
  }
}


class AccountStore {
  constructor() {
    // track accounts by both account id and access key id
	this.accountsNumberback = new Map();  
    this.accountsNumber = new Map();
	this.accountsById = new Map();
    this.accountsByAccessKeyId = new Map();
	this.accByIdNum = new Map();
	this.accessKeyId2 = new Map();	  
	this.secretAccessKeys2 = new Map();
	this.accountId2 = new Map();
	this.displayName2 = new Map();
	this.accountCreatedDate2 = new Map();
	this.accountsWebByNum  = new Map();
	this.accountsWebByName  = new Map();
  }

	
//  assignKeyPair2(accessKeyId, secretAccessKey) {
//    this.secretAccessKeys2.set(accessKeyId, secretAccessKey);
//  }	
	
  getAccountNumber() {
	var lcheck = this.accountsById.size;	  
    return lcheck;	
  }		
	
  addAccount(accountNumber, accountId, displayName, accessKeyId, secretAccessKey) {
	var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
	var hours = d.getHours();
	var minutes = d.getMinutes();
    var nowDate = d.getFullYear() + '-' +
        ((''+month).length<2 ? '0' : '') + month + '-' +
		((''+day).length<2 ? '0' : '') + day + '/' +
        ((''+hours).length<2 ? '0' : '') + hours + ':' +
	    ((''+minutes).length<2 ? '0' : '') + minutes;
  
    const account = new Account(accountNumber, accountId, displayName, accessKeyId);
    this.accountsById.set(accountId, account);
    const accountWeb = new AccountWeb(accountNumber, accessKeyId, secretAccessKey, displayName, accountId, nowDate);
    this.accountsWebByNum.set(accountNumber, accountWeb);
    this.accountsWebByName.set(accessKeyId, accountWeb);
	this.accByIdNum.set(accountNumber, account);
	this.accessKeyId2.set(accountNumber, accessKeyId); 
	this.accountId2.set(accountNumber, accountId); 
	this.displayName2.set(accountNumber, displayName); 	
    this.accountCreatedDate2.set(accountNumber, nowDate);	  
  }

  addKeyPair(accountNumber, accountId, displayName, accessKeyId, secretAccessKey) {
//   (async () => { 
    const account = this.accountsById.get(accountId);
    account.assignKeyPair(accessKeyId, secretAccessKey);
   this.secretAccessKeys2.set(accessKeyId, secretAccessKey);	
    this.accountsByAccessKeyId.set(accessKeyId, account);
// })();
  } 

  revokeKeyPair(accessKeyId) {
    const account = this.accountsByAccessKeyId.get(accessKeyId);
    account.deleteKeyPair(accessKeyId);
    this.accountsByAccessKeyId.delete(accessKeyId);
  }

  getByAccessKeyId(accessKeyId) {
    return this.accountsByAccessKeyId.get(accessKeyId);  
  }


	
  getAllUsers() {	
   	const records = [];
	for (var i = 0, len = 10; i < len; i++) {  
	records[i] = this.accountsWebByNum.get(i+1);   
	}	  
    return records;	
  }					
	
  getaccessKeyId2(accountNumber) {		  
    return this.accessKeyId2.get(accountNumber);	
  }					

  getSecretAccessKey2(accessKeyId) {
    return this.secretAccessKeys2.get(accessKeyId);
  }	

  getaccountId2(accountNumber) {
    return this.accountId2.get(accountNumber);
  }		

  getdisplayName2(accountNumber) {
    return this.displayName2.get(accountNumber);
  }			

  getaccountCreatedDate2(accountNumber) {
    return this.accountCreatedDate2.get(accountNumber);
  }			
	
    	
//  getByAccountId(accessKeyId) {
//    return this.accountsById.get(accessKeyId);  
//  }	

//  getByIdNum(accountNumber) {
//    return this.accByIdNum.get(accountNumber);  
//  }	

  removeAccount(accountId) {
    const account = this.accountsById.get(accountId);
    const accessKeyIds = [...account.secretAccessKeys.keys()];
    accessKeyIds.forEach((accessKeyId) => this.revokeKeyPair(accessKeyId));
    this.accountsById.delete(accountId);
  }
}

module.exports = AccountStore;