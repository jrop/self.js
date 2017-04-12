# self.js

Create self-extracting Node.JS packages.

Self.js works by creating a self-extracting Node.JS script (it embeds the output of `npm pack`).  Later, when a user runs this script, it will unpack itself and execute.

For example, say your package has the following shape:
```
your-package/
	package.json
	index.js
```

You then create a self-extracting script from this package:

```sh
$ self.js (path to your-package) > my-package.js
```

Later when a user executes `my-package.js`, it will extract like:

```
my-package.js
node_modules/
	your-package/
	...other dependencies...
```

Done!

## Installation

```sh
$ npm install --global self.js
# or
$ yarn global add self.js
```

## License

ISC License (ISC)
Copyright 2017 Jonathan Apodaca <jrapodaca@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
