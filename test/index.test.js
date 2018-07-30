/** ****************************************************************************************************
 * @file: index.test.js
 * @project: gonfig
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Jul-2018
 *******************************************************************************************************/
'use strict';

const
	{ version, name } = require( '../package' ),
	{ resolve }       = require( 'path' ),
	chai              = require( 'chai' ),
	chaiAsPromised    = require( 'chai-as-promised' ),
	expect            = chai.expect;

chai.use( chaiAsPromised );

describe( 'Testing Gonfig...', () => {
	const gonfig = require( '../index' );

	it( 'should have constructed fields', () => {
		expect( gonfig ).to.have.property( 'LEVEL' );
		expect( gonfig ).to.have.property( 'ENV' );
		expect( gonfig ).to.have.property( 'symenv' );
		expect( gonfig ).to.have.property( 'sympkg' );
		expect( gonfig ).to.not.have.property( 'env' );
	} );

	it( 'should set log level', () => {
		gonfig.setLogLevel( gonfig.LEVEL.VERBOSE );

		expect( gonfig ).to.have.property( 'log' ).and.eq( 'verbose' );
	} );

	it( 'should set environment variable', () => {
		gonfig.setEnvironment( gonfig.ENV.DEVELOPMENT );

		expect( gonfig ).to.have.property( 'env' ).and.eq( 'development' );
	} );

	it( 'should set some variable', () => {
		gonfig.set( 'number', 100 );

		expect( gonfig.has( 'number' ) ).to.eq( true );
	} );

	it( 'should get some variable', () => {
		expect( gonfig.get( 'number' ) ).to.eq( 100 );
	} );

	it( 'should delete some variable', () => {
		expect( gonfig.delete( 'number' ) ).to.eq( true );
	} );

	it( 'should load database json config', () => {
		gonfig.load( 'db', resolve( 'test/database.json' ) );

		expect( gonfig.get( 'db' ) ).to.have.property( 'host' ).and.eq( '127.0.0.1' );
		expect( gonfig.get( 'db' ) ).to.have.property( 'port' ).and.eq( 1234 );
	} );

	it( 'should refresh system environment variables', () => {
		gonfig.refresh();

		expect( gonfig ).to.have.property( 'debug' ).and.eq( false );
		expect( gonfig ).to.have.property( 'test' ).and.eq( false );
		expect( gonfig.has( gonfig.symenv ) ).to.eq( true );
		expect( gonfig.get( gonfig.symenv ) ).to.have.property( 'NODE_ENV' ).and.eq( gonfig.env );
		expect( gonfig.has( gonfig.sympkg ) ).to.eq( true );
		expect( gonfig.get( gonfig.sympkg ) ).to.have.property( 'version' ).and.eq( version );
	} );

	it( 'should get a environment variable from fallover', () => {
		expect( gonfig.get( 'npm_package_name' ) ).to.eq( name );
	} );

	it( 'should get a package variable from fallover', () => {
		expect( gonfig.get( 'name' ) ).to.eq( name );
	} );

	it( 'should report program information', () => {
		const report = gonfig.getReport();

		expect( report ).to.have.property( 'timestamp' );
		expect( report ).to.have.property( 'name' ).and.eq( name );
		expect( report ).to.have.property( 'version' ).and.eq( version );
		expect( report ).to.have.property( 'nodeVersion' ).and.eq( process.version );
		expect( report ).to.have.property( 'opensslVersion' ).and.eq( process.versions.openssl );
		expect( report ).to.have.property( 'platform' ).and.eq( process.platform );
		expect( report ).to.have.property( 'arch' ).and.eq( process.arch );
		expect( report ).to.have.property( 'cwd' ).and.eq( process.cwd() );
		expect( report ).to.have.property( 'commitNumber' );
	} );

	it( 'should report system information', () => {
		const report = gonfig.getErrorReport();
		
		expect( report ).to.have.property( 'stackTrace' );
		expect( report.stackTrace[ 1 ] ).to.have.property( 'function' ).and.eq( 'it' );
		expect( report.stackTrace[ 1 ] ).to.have.property( 'file' ).and.eq( __filename );
		expect( report.stackTrace[ 1 ] ).to.have.property( 'line' ).and.be.a( 'number' );
		expect( report.stackTrace[ 1 ] ).to.have.property( 'column' ).and.be.a( 'number' );

		expect( report ).to.have.property( 'timestamp' );
		expect( report ).to.have.property( 'name' ).and.eq( name );
		expect( report ).to.have.property( 'version' ).and.eq( version );
		expect( report ).to.have.property( 'nodeVersion' ).and.eq( process.version );
		expect( report ).to.have.property( 'opensslVersion' ).and.eq( process.versions.openssl );
		expect( report ).to.have.property( 'platform' ).and.eq( process.platform );
		expect( report ).to.have.property( 'arch' ).and.eq( process.arch );
		expect( report ).to.have.property( 'cwd' ).and.eq( process.cwd() );
		expect( report ).to.have.property( 'commitNumber' );
	} );
} );
