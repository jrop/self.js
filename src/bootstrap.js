const spawn = require('./spawn')

module.exports = (name, version, pkg, entry = `require('${name}')`) => `#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const PKG = '${pkg}'

function exists() {
	try {
		require.resolve('${name}/package.json')
		return true
	} catch (e) {
		if (!/Cannot find module/.test(e.message))
			throw e
		return false
	}
}
async function first(cmds) {
	for (const trial of cmds) {
		const [cmd, args, opts] = trial
		try {
			await spawn(cmd, args, opts)
			return
		} catch (e) {}
	}
	throw new Error('Could not execute ' + cmds.map(c => c[0]).join(' or '))
}
${spawn.toString()}

async function main() {
	if (!exists()) {
		const tarName = path.resolve('${name}-${version}.tgz')
		await new Promise((y, n) => fs.writeFile(tarName, new Buffer(PKG, 'base64'), e => e ? n(e) : y()))
		await first([
			['yarn', ['add', 'file:' + tarName]],
			['npm', ['install', tarName]]])
		await new Promise((y, n) => fs.unlink(tarName, e => e ? n(e) : y()))
	}
	${entry}
}
main().catch(e => {
	console.error(e)
	process.exitCode = 1
})
`
