
if (typeof window === 'undefined') {
	global.expect = require('expect.js');
} else {
	window.expect = require('expect.js');
}

require('./formatting');
require('./transactionSizeObfuscation');

