/*
Given some json log info (e.g. a browser console log you retrieved), stash it in a file to read later
*/

var fs = require('fs');
var mkpath = require('mkpath');

exports.command = function (log, file, callback) {
    
    this.perform(function(){
        var dirname = file.match(/(.*)[\/\\]/)[1]||'';
        mkpath.sync(dirname);
        fs.writeFile(file, JSON.stringify(log), function(err) {
            if(err) {
                console.log(err);
            }
        }); 

        if(typeof callback==="function"){
            callback.call(this);
        }
    });
    

    return this;
}