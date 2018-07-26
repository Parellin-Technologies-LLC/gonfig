# gonfig
A simple configuration module for Node.js

[![NPM](https://nodei.co/npm/gonfig.png?downloads=true&stars=true&downloadRank=true)](https://www.npmjs.com/package/gonfig)

### Installation

`npm install gonfig --save`

Usage:

```
const Gonfig = require( 'gonfig' );

gonfig
	.setLogLevel( gonfig.LEVEL.VERBOSE )
	.setEnvironment( gonfig.ENV.DEVELOPMENT )
	.load( 'db', resolve( 'test/database.json' ) )
	.refresh();
```

**`.setLogLevel`:**

Setting the log level for reports

`NONE`: to run your program in "silent mode" and _no_ logs will be sent to `process.stdout`
`BASIC`: to signify standard logging
`VERBOSE`: to signify detailed logging

```
gonfig.setLogLevel( gonfig.LEVEL.NONE );
gonfig.setLogLevel( gonfig.LEVEL.BASIC );
gonfig.setLogLevel( gonfig.LEVEL.VERBOSE );

// example of NONE level logging:
Gonfig.setLogLevel( Gonfig.LEVEL.NONE ).refresh();

console.log( 'hello' ); // -> nothing

Gonfig.setLogLevel( Gonfig.LEVEL.BASIC ).refresh();

console.log( 'world' ); // -> "world"

```

**`.setEnvironment`:**

Setting the environment variable

`TEST`: will set process.env to "development" and logging to NONE
`DEBUG`: will set process.env to "development" and logging to VERBOSE
`DEVELOPMENT`: will set process.env to "development"
`PRODUCTION`: will set process.env to "production"

```
gonfig.setEnvironment( gonfig.ENV.TEST );
gonfig.setEnvironment( gonfig.ENV.DEBUG );
gonfig.setEnvironment( gonfig.ENV.DEVELOPMENT );
gonfig.setEnvironment( gonfig.ENV.PRODUCTION );
```

**`.set`:**

Setting a variable for Gonfig to manage

```
gonfig.set( 'number', 100 );
```

**`.get`:**

Returning a variable managed by Gonfig

```
gonfig.get( 'number' ); // 100
```

**`.load`:**

Load a JSON file into memory

```
gonfig.load( 'db', resolve( 'test/database.json' ) );
```

**`.refresh`:**

Optionally call this method if you want refresh your configurations

```
gonfig.refresh();
```

**`.getReport`:**

Get a system report. Includes the following information:

- `timestamp` - time the report is requested
- `name` - name of the program
- `version` - version of the program
- `nodeVersion` - running node version
- `opensslVersion` - current openssl version
- `platform` - current platform
- `arch` - current architecture
- `cwd` - current working directory
- `commitNumber` - program commit number

```
gonfig.getReport();
```

**`.getErrorReport`:**

Get a system report. Includes all information from `.getReport` with a `stackTrace`.
Stack trace includes pretty printed file name, line/column number, etc.

```
gonfig.getErrorReport();
```

