/*
 * Create and export configuration variables
 *
 */

 // Contain for all the enviroment
var environments = {};

// Staging (default) enviroment
environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging'
};


// production enviroment
environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production'
};

// Determine which evireoment was passed a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// check that the current envirement is one of the enviroment aboveif not defult to staging

var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// expoert the module

module.exports = environmentToExport;