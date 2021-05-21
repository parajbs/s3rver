'use strict';

module.exports = function (app) {

const debugerlevel = app;
const debugfile = require('./debuglogger').createLogger('tmp/logfiles/debug.log');	
const debuger =  debugfile;
    debuger.format = function(level, date, message) {
    return level + " [ " + date.getDate().toString() + "." + date.getDay().toString() + "." + date.getFullYear().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString() + " ]" + message ;
    };
debuger.setLevel(debugerlevel);
return debuger;
};
 

