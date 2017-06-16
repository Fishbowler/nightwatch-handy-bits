/* 
Based on https://github.com/rarcega/nightwatch-custom-html-reporter
This requires that input is comma seperated already so is a bit of a sham, to be honest, but I've not thought of a solution to that (without modding Nightwatch)
*/

var fs = require('fs');
var path = require('path');

module.exports = new (function() {

  this.write = function(results, options, callback) {

    var defaultOptions = {failuresOnly: true}; //By default, ignore PASS & SKIP.

    var theseOptions = (options ? Object.assign({}, defaultOptions, options) : defaultOptions) //If some options provided, merge them over defaultOptions
    var reportFilename = options.filename_prefix + Date.now() + '.csv';
    var reportFilePath = path.join(options.output_folder, reportFilename);
    var csvOutput = '';

    var resultsKeys = Object.keys(results.modules);
    resultsKeys.forEach(function(resultsKey){
      var completedKeys = Object.keys(results.modules[resultsKey].completed);
      completedKeys.forEach(function(completedKey){
        var theseAssertions = results.modules[resultsKey].completed[completedKey].assertions;
        theseAssertions.forEach(function(assertion){
          if(assertion.message.trim() === ''){
            return;
          }
          if((!theseOptions.failuresOnly) || assertion.failure){ //If we aren't filtering, or it's got a failure
            var csvLine = '';
            if(assertion.message){
              csvLine += assertion.message;
            }
            if(assertion.failure){
              //csvLine += (csvLine.length > 0 ? ',' : '') + assertion.failure;
            }
            csvLine += (csvLine.length > 0 ? '\n' : '');
            csvOutput += csvLine;
          }
        })
      })
    })

    // write the html to a file
    fs.writeFile(reportFilePath, csvOutput, function(err) {
      if (err) throw err;
      console.log('Report generated: ' + reportFilePath);
      callback();
    });
    
    
  }
})();