var formatting = require('../src/format');

var ownedLease = require('json!./data/owned');

var unownedLease = require('json!./data/unowned');

var ownedGood = require('json!./data/ownedGood');

var unownedGood = require('json!./data/unownedGood');

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

