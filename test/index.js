'use strict';

var test = require('tape');
var server = require('./test-server');

var fs = require('fs');

var padcef = require('..');
var postcss = require('postcss');

var fontsDir = '../external-fonts';

var minifing = function (css) {
	css.eachDecl(function (decl) {
		decl.before  = '';
		decl.between = ':';
	});
	css.eachRule(function (rule) {
		rule.before  = '';
		rule.between = '';
		rule.after   = '';
	});
	css.eachAtRule(function (atRule) {
		atRule.before  = '';
		atRule.between = '';
		atRule.after   = '';
	});
	css.eachComment(function (comment) {
		comment.removeSelf();
	});
};

function read(name) {
	return fs.readFileSync('test/' + name + '.css', 'utf8').trim();
}

function compareFixtures(t, name, msg, opts /*, postcssOpts*/) {
	opts = opts || { dest: fontsDir };

	// Actual and expected are minified before matching test
	var actual = postcss().use(padcef(opts)).use(minifing).process(read('fixtures/' + name)).css.trim();
	var expected = postcss().use(minifing).process(read('fixtures/' + name + '.expected')).css.trim();

	// check font files are present

	// handy thing: checkout actual in the *.actual.css file
	fs.writeFile('test/fixtures/' + name + '.actual.css', actual);

	t.equal(actual, expected, msg);
}

test('Replace @font-faces', function(t) {
	var srv = server();
	srv.listen(9001);

	compareFixtures(t, 'only-font-faces', 'should transform and download font-faces');

	//setTimeout(f1, 10000);

	srv.close();

	t.end();
});

//test('@import error output', function(t) {
//	t.doesNotThrow(
//		function() {
//			var file = importsDir + '/import-missing.css';
//			assert.throws(
//				function() {postcss().use(padcef({path: [importsDir, '../node_modules']})).postcss(fs.readFileSync(file), {from: file});},
//				/import-missing.css:2:5 Failed to find 'missing-file.css'\n\s+in \[/gm
//			);
//		},
//		'should output readable trace'
//	);
//
//	t.end();
//});

