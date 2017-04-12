module.exports = function spawn(cmd, args = [], opts = {stdio: 'inherit', env: process.env}) {
	const {spawn} = require('child_process')
	function defer() {
		const d = {}
		d.promise = new Promise((y, n) => {
			d.resolve = y
			d.reject = n
		})
		return d
	}
	const deferred = defer()
	const p = spawn(cmd, args, opts)
	p.on('exit', code => {
		p.exitCode = code
		if (code == 0) deferred.resolve(p)
		else deferred.reject(new Error(`Unexpected exit code: ${code}`))
	})
	p.on('error', err => deferred.reject(err))
	
	return deferred.promise
}
