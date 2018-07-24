/** ****************************************************************************************************
 * @file: Gonfig.js
 * @project: gonfig
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 24-Jul-2018
 *******************************************************************************************************/
'use strict';

const LightMap = require( '@parellin/lightmap' );

class Gonfig extends LightMap
{
	constructor()
	{
		super();

		return new Proxy( this, {
			get( target, key, proxy )
			{
				console.log( `getting ${ key }` );
				return target.get( key );
			},
			set( target, key, val, proxy )
			{
				console.log( `setting ${ key }` );
				return target.set( key, val );
			},
			has( target, key, proxy )
			{

			}
		} );

		this.ENV = {
			TEST: 'test',
			DEBUG: 'debug',
			DEVELOPMENT: 'development',
			PRODUCTION: 'production'
		};

		this.env = env || this.ENV.DEBUG;

		this.refresh( this.env );
	}

	invalidConfig()
	{
		throw new Error( `Configuration Error - ${ this.env } is not a valid environment` );
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

	refresh( env = this.ENV.DEBUG )
	{
		this.env = env;

		this.debug = this.env === this.ENV.DEBUG;
		this.test  = this.env === this.ENV.TEST;

		if( this.env === this.ENV.DEBUG || this.env === this.ENV.TEST ) {
			this.env = this.ENV.DEVELOPMENT;

			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
		} else {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
		}

		!this.isValidEnvironment( this.env ) || this.invalidConfig();

		process.env.NODE_ENV = this.env;
	}
}


const handler = {
	get( target, key, ref )
	{
		let val = Reflect.get( ...arguments );

		console.log( `getting ${ key }` );

		if( typeof val === 'string' ) {
			val = val.replace( target );
		}

		return val;
	},
	set( target, key, val, ref )
	{
		console.log( `setting ${ key }` );
		// Maybe set $ref to compress object size IF there's an object match?

		return Reflect.set( ...arguments );
	}
};

const data = new Gonfig();

data.ok = 'cool';
data.co = 'yo';

console.log( data.ok );
// key|(\$ref:key)



module.exports = new Gonfig();
