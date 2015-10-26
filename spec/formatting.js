var formatting = require('../src/format');

var ownedLease = require('./data/owned');

var unownedLease = require('./data/unowned');

var ownedGood = require('./data/ownedGood');

var unownedGood = require('./data/unownedGood');

describe('Owned Lease', function () {

	var ownedData = formatting.format(ownedLease, 'en_US');

	ownedData.forEach(function (data, i) {
		it('should format '+data.name+' correctly', function () {
			expect(data).to.eql(ownedGood[i]);
		});
	});


});

describe('Unowned Lease', function () {

	var unownedData = formatting.format(unownedLease, 'en_US');

	unownedData.forEach(function (data, i) {
		it('should format '+data.name+' correctly', function () {
			expect(data).to.eql(unownedGood[i]);
		});
	});

});

