/*
Don't forget to `npm install --save png-crop`
Given an image (a screenshot you've just taken), will trim the image to the location and dimensions of the bit you want
*/

var pngcrop = require('png-crop');

exports.command = function (imagefile, left, top, width, height, padding, callback) {
	
	//png-crop example from https://github.com/nightwatchjs/nightwatch/issues/547
	var config = {left: left, height: height, top: top, width: width};
	
	if(padding && padding > 0){
		config.left -= padding;
		config.top -= padding;
		config.height += (2* padding);
		config.width += (2* padding);
	}
	
	pngcrop.crop(imagefile,imagefile,config, function(err){
		if(err){
			console.log(err);
			throw err;
		}
		console.log('Cropped screenshot');
		if (typeof callback === "function") {
			callback.call(self);
		}
		return this;
	});
	
	
}
