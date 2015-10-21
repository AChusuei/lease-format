
var formatting = require('../src/format');

describe('Transaction Size Obfuscation', function () {
	it('should make anything less than 10K 0-10K', function () {
		var obfuscated = formatting.obscureTransactionSize(10);
		expect(obfuscated).to.equal('0-10K');

		obfuscated = formatting.obscureTransactionSize(100);
		expect(obfuscated).to.equal('0-10K');

		obfuscated = formatting.obscureTransactionSize(500);
		expect(obfuscated).to.equal('0-10K');

		obfuscated = formatting.obscureTransactionSize(1000);
		expect(obfuscated).to.equal('0-10K');

		obfuscated = formatting.obscureTransactionSize(5000);
		expect(obfuscated).to.equal('0-10K');

		obfuscated = formatting.obscureTransactionSize(9999);
		expect(obfuscated).to.equal('0-10K');

	});

	it('should round anything less than 100K to 10K', function () {
		var obfuscated = formatting.obscureTransactionSize(10000);
		expect(obfuscated).to.equal('10-20K');

		obfuscated = formatting.obscureTransactionSize(20000);
		expect(obfuscated).to.equal('20-30K');

		obfuscated = formatting.obscureTransactionSize(25000);
		expect(obfuscated).to.equal('20-30K');

		obfuscated = formatting.obscureTransactionSize(99999);
		expect(obfuscated).to.equal('90-100K');
	});

	it('should round anything between 100K and 1m to 50K', function () {
		var obfuscated = formatting.obscureTransactionSize(100000);
		expect(obfuscated).to.equal('100-150K');

		obfuscated = formatting.obscureTransactionSize(530000);
		expect(obfuscated).to.equal('500-550K');

		obfuscated = formatting.obscureTransactionSize(999999);
		expect(obfuscated).to.equal('950-1,000K');
	});

	it('should round anything 1m or above to the nearest million', function () {
		var obfuscated = formatting.obscureTransactionSize(1000000);
		expect(obfuscated).to.equal('1-2M');

		obfuscated = formatting.obscureTransactionSize(1500000);
		expect(obfuscated).to.equal('1-2M');

		obfuscated = formatting.obscureTransactionSize(2000001);
		expect(obfuscated).to.equal('2-3M');
	});
});
