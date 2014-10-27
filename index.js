/**
 * Function to parse and download CSS external fonts
 * @link https://github.com/postcss/postcss
 * @link https://github.com/kevva/download
 */
'use strict';

var Download = require('download');

function Padcef(options) {
	options = options || {};
	options.dest = options.dest || 'external-fonts';

	return function(style) {
		// parse @font-face from css
		var urls = {};

		style.eachAtRule(function checkAtRule(atRule) {
			if (atRule.name !== 'font-face') {
				return;
			}

			atRule.eachDecl(function (decl) {
				if (decl.prop === 'src') {
					//console.log(decl.value);
					decl.value = decl.value.replace(/url\s*\(\s*(['"]?)([^"'\)]*)\1\s*\)/gi, function(match) { // , location
						var url;
						match = match.replace(/\s/g, '');
						url = match.slice(4, -1).replace(/"|'/g, '').replace(/\\/g, '/');
						if (/^\/|https:|http:/i.test(url) !== false) {
							//console.log('found: ' + url);
							urls[url] = true;
							url = options.dest + '/' + url.substring(url.lastIndexOf('/') + 1);
						}
						return 'url("' + url + '")';
					});
				}
			});
		});

		// Make URLs unique
		var filesToDownload = Object.keys(urls);

		// Download external files
		var download = new Download({ mode: '644' }).dest(options.dest);

		for (var i = 0 ; i < filesToDownload.length ; i++) {
			download.get(filesToDownload[i]);
		}

		download.run(function (err) { // files, stream
			if (err) {
				throw err;
			}
		});

	};
}


/**
 * Exports module
 */
module.exports = Padcef;
