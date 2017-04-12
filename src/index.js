const {transform} = require('babel-core')
const assert = require('assert')
const bootstrap = require('./bootstrap')
const fs = require('mz/fs')
const path = require('path')
const spawn = require('./spawn')
const yargs = require('yargs')

async function exists(f) {
	try {
		await fs.stat(f)
		return true
	} catch (e) {
		return false
	}
}

async function dirToBase64(directory, name, version) {
	assert(await exists(path.join(directory, 'package.json')), `No package.json found in directory '${directory}'`)
	const tgz = path.join(directory, `${name}-${version}.tgz`)
	await spawn('npm', ['pack'], {env: process.env, cwd: directory})
	const pkg = await fs.readFile(tgz, 'base64')
	await fs.unlink(tgz)
	return pkg
}

async function main() {
	const {argv} = yargs.usage('$0 [options] DIRECTORY')
		.help().alias('h', 'help')
		.version(require('../package').version).alias('v', 'version')
		.option('entry', {
			alias: 'e',
			description: 'The JS to run once packages are installed',
			type: 'string',
		})
		.option('source-map', {
			alias: 'm',
			description: 'Generate an inline source-map',
			type: 'boolean',
		})
		.demand(1, 'You must provide a directory from which to start')

	const directory = path.resolve(argv._[0])
	const {name, version} = require(path.join(directory, 'package.json'))
	const pkg = await dirToBase64(directory, name, version)
	
	const source = bootstrap(name, version, pkg, argv.entry)
	const {code} = transform(source, {
		filename: 'self.js',
		presets: [['env', {
			targets: {
				node: 6,
			},
		}]],
		sourceMap: argv.sourceMap ? 'inline': false
	})
	console.log(code)
}
main().catch(e => {
	console.error(e)
	process.exitCode = 1
})
