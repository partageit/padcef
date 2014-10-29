'use strict';

var test = require('tape');
//var assert = require('assert');

var fs = require('fs');
var postcss = require('postcss');

var server = require('./test-server');
var padcef = require('..');

var fontsDir = '../external-fonts';
var srv = server();

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
	return fs.readFileSync('test/fixtures/' + name + '.css', 'utf8').trim();
}

function startSrv() {
	srv.listen(9001);
}

function stopSrv() {
	setTimeout(function() { srv.close(); }, 5000);
}

function compareFixtures(t, name, msg, opts /*, postcssOpts*/) {
	opts = opts || { dest: fontsDir };

	// Actual and expected are minified before matching test
	var actual = postcss().use(padcef(opts)).use(minifing).process(read(name)).css.trim();
	var expected = postcss().use(minifing).process(read(name + '.expected')).css.trim();

	// check font files are present

	// handy thing: checkout actual in the *.actual.css file
	fs.writeFile('test/fixtures/' + name + '.actual.css', actual);

	t.equal(actual, expected, msg);
}

test('Replace @font-faces', function(t) {
	var opts = { dest: fontsDir };
	startSrv();

	compareFixtures(t, 'only-font-faces', 'should transform and download font-faces', opts);
	compareFixtures(t, 'font-faces-and-pictures', 'should transform and download font-faces, not background images', opts);
	compareFixtures(t, 'font-faces-in-media', 'should transform and download font-faces, even in @media', opts);
	compareFixtures(t, 'no-font-faces', 'should do nothing', opts);

//	t.doesNotThrow(
//		function() {
//			assert.throws(
//				function() {
//					postcss().use(padcef(opts)).use(minifing).process(read('error-unreachable-font-faces')).css.trim();
//				},
//				/Couldn't connect to/gm
//			);
//		},
//		'should output readable trace'
//	);

	stopSrv();

	t.end();
});
