/*
Using Nightwatch as tools assisted testing by iterating through a bunch of similar pages, and screenshotting just the bit we're interested in.
I've trimmed it down, but there's still some cruft in here that's specific to my context. Refinements welcome!

Relies on the `cropscreenshot` custom command
*/
var screenshots = [{"url":"/support"}
						,{"url":"/support/contact"}
						,{"url":"/support/logging-in"}
						,{"url":"/support/registering"}
						,{"url":"/support/registering/already-registered"}
						,{"url":"/support/registering/contact"}];

var screenshotpadding = 15;

module.exports = {
	'Support Screenshots - UK - Desktop' : function (browser) {
		screenshotSupport(browser,'https://example.com','desktop','GB')
	}
};

function screenshotSupport(browser,rooturl,platform,region){

	browser
			.url(rooturl + '/?country=' + region)
			.waitForElementVisible('body', 20000);

	screenshots.forEach(function(supportscreenshot){
		var screenshotname = ''
				+ platform + '-'
				+ supportscreenshot["url"] + '-'
				+ region + '-'
				+ browser.globals.env + '-'
				+ new Date().getTime().toString()
				+ '.png';
		var screenshotpath = 'screenshots/' + makeSafeForFileSystem(screenshotname);
		var supportURL = rooturl + supportscreenshot["url"];
		var sectionID = getSupportSectionCSSSelectorFromURL(supportscreenshot["url"]);
		var position, size;
		browser
			.url(supportURL)
			.execute(function(){  //Disable animations and transition effects for easier screenshots
				$("body").append($("style").html("*{\
					-webkit-transition: none !important;\
					-moz-transition: none !important;\
					-o-transition: none !important;\
					-ms-transition: none !important;\
					transition: none !important;\
					-webkit-animation: none !important;\
					-moz-animation: none !important;\
					-o-animation: none !important;\
					-ms-animation: none !important;\
					animation: none !important;\
					}"));
				return true;
			},[])
			.waitForElementVisible(sectionID, 20000)
			.assert.elementPresent(sectionID)
			.pause(250);
			if(platform === 'mobile'){
				browser
					.resizeWindow(640,960)  // iPhone 4S - http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
					.saveScreenshot(screenshotpath);
			}
			if(platform === 'desktop'){
				browser
					.getLocation('#MyPopup',function(pos){
							position = pos.value;
							browser.getElementSize('#MyPopup',function(sz){
								size = sz.value;
							});
						})
					.saveScreenshot(screenshotpath,function(){
						if(browser.globals.env !== 'edge'){
							browser.cropscreenshot(screenshotpath, position.x, position.y, size.width, size.height, screenshotpadding);
						}
					})
			}

	});
	browser.end();
}

function makeSafeForFileSystem(string){
	return string
		.replace(/\//g,'-') //Swap forward slashes for dashes
		.replace(/=/g,'-')  //Swap equals for dashes
		.replace(/\?/g,'')  //Drop question marks
		.replace(/ /g,'_'); //Swap spaces for underscores
}

function getSupportSectionCSSSelectorFromURL(url){
	//Some business logic on how URLs match our css selectors
	fixedString = url
					.slice(1)            //Remove the first slash
					.replace(/\//g,'_')  //Swap any other forward slashes for underscores
					.replace(/[_\-]./g,function(txt){return txt.toUpperCase();}) //Upper case anything after an underscore or hyphen
					.replace(/^./g,function(txt){return txt.toUpperCase();}) //Upper case the first character
					.replace(/-/g,'');   //Drop hyphens
	fixedString = '#' + fixedString; //Because it's an element id
	return fixedString;
}