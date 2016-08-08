exports.config = {

	allScriptsTimeout: 99999,

	directConnect: true,

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome'
	},

	baseUrl: 'http://localhost:9001/', //must be 9001 because grunt-test is in port 9001

	framework: 'jasmine',

	// Spec patterns are relative to the current working directly when
	// protractor is called.
	specs: ['test/e2e/*.js'],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		isVerbose : true,
		includeStackTrace : true
	}
};
