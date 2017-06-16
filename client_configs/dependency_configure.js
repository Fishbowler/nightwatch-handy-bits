var fs = require('fs');
var path = require('path');
const os = require('os');

var seleniumdriverpath = 'node_modules/selenium-standalone/.selenium';

function getFirstNonZip(path){
    filelist=fs.readdirSync(path);
    filelist=filelist.filter(function(element){
        return (element.indexOf('.zip') == -1) //Not a zip
    });
    filelist.sort();
    filelist.reverse();
    if(filelist.length>0){
        return filelist[0]; //Take the top one - we don't know more
    } else {
        return null;
    }
}

var config_file = 'nightwatch.json';
var config_file_content = JSON.parse(fs.readFileSync(config_file));

// EDGE & IE
var iedriverconfigvalue = ''
var edgedriverconfigvalue = ''
if(process.platform == 'win32'){
    // IE
    var iedriverpathsuffix = 'iedriver';
    var iedriverfolder = path.join(seleniumdriverpath,iedriverpathsuffix);
    var iedriverbinary = getFirstNonZip(iedriverfolder);
    iedriverconfigvalue = (iedriverbinary ? path.join(seleniumdriverpath,iedriverpathsuffix,iedriverbinary) : '');

    // Edge
    var edgebinary = 'C:\\Program Files (x86)\\Microsoft Web Driver\\MicrosoftWebDriver.exe';
    try{
        fs.accessSync(edgebinary, fs.R_OK)
        edgedriverconfigvalue = edgebinary;
    }catch(e){
        console.log('Edge Driver not installed. See https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/');
    }
}
config_file_content.selenium.cli_args["webdriver.ie.driver"] = iedriverconfigvalue;
config_file_content.selenium.cli_args["webdriver.edge.driver"] = edgedriverconfigvalue;

// CHROME
var chromedriverpathsuffix = 'chromedriver'
var chromedriverfolder = path.join(seleniumdriverpath,chromedriverpathsuffix);
var chromedriverbinary = getFirstNonZip(chromedriverfolder);
var chromedriverconfigvalue = (chromedriverbinary ? path.join(seleniumdriverpath,chromedriverpathsuffix,chromedriverbinary) : '');
config_file_content.selenium.cli_args["webdriver.chrome.driver"] = chromedriverconfigvalue;

// FIREFOX
var geckodriverpathsuffix = 'geckodriver'
var geckodriverfolder = path.join(seleniumdriverpath,geckodriverpathsuffix);
var geckodriverbinary = getFirstNonZip(geckodriverfolder);
var geckodriverconfigvalue = (geckodriverbinary ? path.join(seleniumdriverpath,geckodriverpathsuffix,geckodriverbinary) : '');
config_file_content.selenium.cli_args["webdriver.gecko.driver"] = geckodriverconfigvalue;

// SELENIUM
var seleniumserverpathsuffix = 'selenium-server'
var seleniumserverfolder = path.join(seleniumdriverpath,seleniumserverpathsuffix);
var seleniumserverbinary = getFirstNonZip(seleniumserverfolder);
var seleniumserverconfigvalue = (seleniumserverbinary ? path.join(seleniumdriverpath,seleniumserverpathsuffix,seleniumserverbinary) : '');
config_file_content.selenium["server_path"] = seleniumserverconfigvalue;

// Actually write the file
fs.writeFileSync(config_file, JSON.stringify(config_file_content,null,'\t'));