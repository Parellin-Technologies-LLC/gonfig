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

class Gonfig extends LightMap
{
	constructor()
	{
		super();

		this.LEVEL = {
			NONE: 'none',
			BASIC: 'basic',
			VERBOSE: 'verbose'
		};

		this.ENV = {
			TEST: 'test',
			DEBUG: 'debug',
			DEVELOPMENT: 'development',
			PRODUCTION: 'production'
		};

		this.symenv = Symbol( '$env' );
		this.sympkg = Symbol( '$pkg' );
		this.stdout = process.stdout.write;

		this.cwd     = process.cwd();
		this.isReady = false;
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

	refreshIfNotLoaded()
	{
		return this.isReady || this.refresh();
	}

	refresh()
	{
		this.isReady = true;

		this.env = this.env || this.ENV.DEVELOPMENT;
		this.log = this.log || this.LEVEL.BASIC;

		this.debug = this.debug || this.env === this.ENV.DEBUG;
		this.test  = this.test || this.env === this.ENV.TEST;

		if( this.debug ) {
			this.log = this.LEVEL.VERBOSE;
		} else if( this.test ) {
			this.log = this.LEVEL.NONE;
		}

		if( this.log === this.LEVEL.NONE ) {
			process.stdout.write = () => {};
		} else {
			process.stdout.write = this.stdout;
		}

		if( this.env === this.ENV.DEBUG || this.env === this.ENV.TEST ) {
			this.env = this.ENV.DEVELOPMENT;

			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		} else {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
		}

		!this.isValidEnvironment( this.env ) || this.invalidConfig();

		this.set( this.symenv, process.env );
		this.set( this.sympkg, require( join( process.cwd(), 'package.json' ) ) );

		process.title        = `${ this.get( 'name' ) }-v${ this.get( 'version' ) }`;
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

	get( key )
	{
		return super.has( key ) ? super.get( key ) :
			super.get( this.symenv ).hasOwnProperty( key ) ? super.get( this.symenv )[ key ] :
				super.get( this.sympkg ).hasOwnProperty( key ) ? super.get( this.sympkg )[ key ] : null;
	}

	set( key, value )
	{
		super.set( key, value );
		return this;
	}

	load( key, value )
	{
		this.refreshIfNotLoaded();

		if( /(.js(on)?)$/.test( extname( value ) ) ) {
			if( !value.startsWith( this.cwd ) ) {
				value = join( this.cwd, value );
			}

			value = require( value );
		}

		return this.set( key, value );
	}

	getReport()
	{
		this.refreshIfNotLoaded();

		const
			timestamp    = new Date(),
			commitNumber = ( this.get( this.symenv ).npm_package_gitHead || '' ).substr( 0, 6 );

		return this.log === this.LEVEL.VERBOSE ? {
			timestamp,
			name: this.get( this.sympkg ).name,
			version: this.get( this.sympkg ).version,
			nodeVersion: process.version,
			opensslVersion: process.versions.openssl,
			platform: process.platform,
			arch: process.arch,
			cwd: process.cwd(),
			commitNumber
		} : this.log === this.LEVEL.BASIC ? {
			timestamp,
			name: this.get( this.sympkg ).name,
			version: this.get( this.sympkg ).version,
			nodeVersion: process.versions.node,
			cwd: process.cwd(),
			commitNumber
		} : {
			timestamp,
			name: this.get( 'name' ),
			version: this.get( 'version' )
		};
	}

	getErrorReport( err = new Error() )
	{
		const _                 = Error.prepareStackTrace;
		Error.prepareStackTrace = ( _, stack ) => stack;
		const stack             = err.stack.slice( 0 );
		Error.prepareStackTrace = _;

		const stackTrace = stack.map( callee => {
			return {
				type: callee.getTypeName(),
				function: callee.getFunction() || callee.getFunctionName(),
				method: callee.getMethodName(),
				file: callee.getFileName(),
				line: callee.getLineNumber(),
				column: callee.getColumnNumber(),
				origin: callee.getEvalOrigin(),
				topLevel: callee.isToplevel(),
				isEval: callee.isEval(),
				isNative: callee.isNative(),
				isConstructor: callee.isConstructor()
			};
		} );

		return {
			stackTrace,
			...this.getReport()
		};
	}
}

module.exports = new Gonfig();
