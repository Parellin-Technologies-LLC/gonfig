/** ****************************************************************************************************
 * @file: Gonfig.js
 * @project: gonfig
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 24-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	{
		extname,
		join
	}        = require( 'path' ),
	LightMap = require( '@parellin/lightmap' );

class Gonfig
{
	constructor()
	{
		this.LEVEL = {
			NONE: 'none',
			BASIC: 'basic',
			VERBOSE: 'verbose'
		};

		this.ENV = {
			UNKNOWN: 'unknown',
			TEST: 'test',
			DEBUG: 'debug',
			DEVELOPMENT: 'development',
			PRODUCTION: 'production'
		};

		this.symenv = '$env';
		this.sympkg = '$pkg';

		this.config = new LightMap();
	}

	invalidConfig()
	{
		throw new Error( 'Configuration Error - invalid environment settings' );
	}

	isValidLogLevel( log )
	{
		return this.LEVEL.hasOwnProperty( log );
	}

	isValidEnvironment( env )
	{
		return this.ENV.hasOwnProperty( env );
	}

	isProduction()
	{
		return this.env === this.ENV.PRODUCTION;
	}

	isDevelopment()
	{
		return this.env === this.ENV.DEVELOPMENT;
	}

	start()
	{
		this.env = this.env || this.ENV.DEBUG;
		this.log = this.log || this.LEVEL.BASIC;

		this.debug = this.env === this.ENV.DEBUG;
		this.test  = this.env === this.ENV.TEST;

		if( this.debug ) {
			this.log = this.LEVEL.VERBOSE;
		} else if( this.test ) {
			this.log = this.LEVEL.NONE;
		}

		if( this.env === this.ENV.DEBUG || this.env === this.ENV.TEST ) {
			this.env = this.ENV.DEVELOPMENT;

			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		} else {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
		}

		!this.isValidEnvironment( this.env ) || this.invalidConfig();

		this.config.set( this.symenv, process.env );
		this.config.set( this.sympkg, require( join( process.cwd(), 'package.json' ) ) );

		process.title        = `${ this.config.get( 'name' ) }-v${ this.config.get( 'version' ) }`;
		process.env.NODE_ENV = this.env;

		return this;
	}

	setLogLevel( log = this.LEVEL.BASIC )
	{
		!this.isValidLogLevel( log ) || this.invalidConfig();
		this.log = log;
		return this;
	}

	setEnvironment( env = this.ENV.DEBUG )
	{
		!this.isValidEnvironment( env ) || this.invalidConfig();
		this.env = env;
		return this;
	}

	load( key, value )
	{
		if( extname( value ) === '.json' ) {
			value = require( value );
		}

		this.config.set( key, value );

		return this;
	}

	get( key )
	{
		return this.config.has( key ) ? this.config.get( key ) : this;
	}

	getReport()
	{
		const timestamp = new Date();

		return this.log === this.LEVEL.VERBOSE ? {
			timestamp,
			name: this.config.get( this.sympkg ).name,
			version: this.config.get( this.sympkg ).version,
			nodeVersion: process.versions.node,
			opensslVersion: process.versions.openssl,
			platform: process.platform,
			arch: process.arch,
			cwd: process.cwd()
		} : this.log === this.LEVEL.BASIC ? {
			timestamp,
			name: this.config.get( this.sympkg ).name,
			version: this.config.get( this.sympkg ).version,
			nodeVersion: process.versions.node,
			cwd: process.cwd()
		} : {
			timestamp,
			name: this.config.get( 'name' ),
			version: this.config.get( 'version' )
		};
	}
}

const gonfig = new Gonfig();

gonfig
	.setLogLevel( gonfig.LEVEL.BASIC )
	.setEnvironment( gonfig.ENV.DEBUG )
	.load( 'db', '/Users/trashcan/GitHub/gonfig/config/database.json' )
	.load( 'another', '/Users/trashcan/GitHub/gonfig/config/database.json' )
	.start();

console.log( gonfig );
console.log( gonfig.getReport() );

console.log( process.getgid() );
module.exports = new Gonfig();
