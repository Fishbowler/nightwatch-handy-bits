/*
If you wanna check the console logs after an event, you might wanna be sure they're clear beforehand.
*/

exports.command = function (callback) {
    var self = this;
    
    self.execute(function(){
        console.API;
        if (typeof console._commandLineAPI !== 'undefined') {
            console.API = console._commandLineAPI; //chrome
        } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
            console.API = console._inspectorCommandLineAPI; //Safari
        } else if (typeof console.clear !== 'undefined') {
            console.API = console;
        }

        console.API.clear();

        return true;
    });
        
     if(typeof callback==="function"){
        callback.call(self);
    }
    return self;
}