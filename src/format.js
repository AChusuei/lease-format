(function(factory) {

    //AMD
    if(typeof define === 'function' && define.amd) {
        define([
			'ramda',
			'../attributes/index',
			'ui/util/number',
			'ui/util/percent',
			'ui/util/abbreviateNumber',
			'ui/util/money',
			'ui/util/months',
			'ui/util/calendarDate',
			'ui/util/floorDetails'
        ], factory);

    //NODE
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory(
			require('ramda'),
			require('../attributes/index'),
			require('ui/util/number'),
			require('ui/util/percent'),
			require('ui/util/abbreviateNumber'),
			require('ui/util/money'),
			require('ui/util/months'),
			require('ui/util/calendarDate'),
			require('ui/util/floorDetails')
		);
    }

})(function (R, attributes, number, percent, abbreviateNumber, money, months, date, floorDetails) {
	
	var exports = {};

	// over 100,000 round to 50,000
	exports.obscureTransactionSize = function (transactionSize) {
		var low;
		var high;

		if(typeof transactionSize === 'string') {
			return transactionSize;
		}
		var roundTo = 10000;
		var divideBy = 1000;
		var scale = 'K';
		if (transactionSize >= 1000000) { // 1,000,000
			roundTo = 1000000;
			divideBy = 1000000;
			scale = 'M';
		} else if (transactionSize >= 100000) {
			roundTo = 50000;
		} else if (transactionSize < 10000) {
			low = 0;
			high = 10000;
		}

		low = Math.floor(transactionSize / roundTo) * roundTo;
		high = low + roundTo;
		
		low = Math.floor(low / divideBy);
		high = Math.floor(high / divideBy);

		return number(low)+'-'+number(high)+scale;
	};

	exports.formatValue = function (propertyName, value, marketName) {

		var currency = marketName === 'London' ? 'GBP' : 'USD';

		var attribute = attributes.hash(marketName)[propertyName];

		// special cases of missing attributes on the list that need to be formatted properly
		// I'm adding the !attribute just in case that they get added later
		if (!attribute && ['dateCreated', 'ti'].indexOf(propertyName) !== -1) {
			attribute = { name: propertyName };
		}

		// if we couldn't find the attribute on the list, we can't format the value
		if (!attribute) return value;

		// simple yes/no case
		if (attribute.name === 'sublease') {
			value =	 value ? "Yes" : "No";
		}

		// currentRent and ti don't have preUnit
		if (value !== null && ['currentRent', 'effectiveRent', 'ti'].indexOf(attribute.name) !== -1) {
			value = money(value, currency);
		}

		// buildingOfficePortion doesn't have a postUnit, so we need to add the SF manually. also, the
		// backend is sending us 'sqft' and we're showing SF everywhere, so we'll convert in that particular case
		if (typeof value === 'number' && attribute.name === 'buildingOfficePortion') {
			value = number(value.value) + ' ' + (value.unit === 'sqft' ? 'SF' : value.unit);
		}

		// because the date is now ISO 8601, we need to transform it to the american format of MM/DD/YYYY
		if (value !== null && ['commencementDate', 'dateCreated', 'executionDate', 'expirationDate'].indexOf(attribute.name) !== -1) {
			value = date(value, true); // the second argument will make the year appear with 4 digits
		}

		// special cases when we receive a object { numberOfSpots: value, pricePerSpot: value }
		if (['buildingParkingReserved', 'buildingParkingUnreserved'].indexOf(attribute.name) !== -1) {
			if (value.numberOfSpots && value.pricePerSpot) {
				value = value.numberOfSpots + "/" + money(value.pricePerSpot, currency);
			}
		}

		// executionQuarter special case
		if (attribute.name === 'executionQuarter') {
			value = value.year + " - Q" + value.quarter;
		}

		// leaseEscalations special case: array of objects like { dollars: value, months: value }
		if (value !== null && attribute.name === 'leaseEscalations') {
			value = value.map(function (escalation) {
				return money(escalation.dollars, currency) + "/" + months(escalation.months);
			}).join(", ");
		}

		// floorOccupancies special case. Fortunately the backend sends the formatted value on the payload
		if (value !== null && attribute.name === 'floorOccupancies') {
			value = value.formatted;
		}

		// mainFloorDetails special case.
		if (value !== null && attribute.name === 'mainFloorDetails' && value) {
			value = floorDetails(value);
		}

		// otherFloorsDetails - similar to mainFloorDetails, just an array
		if (value !== null && attribute.name === 'otherFloorsDetails') {
			value = value.map(function (floor) { return floorDetails(floor); }).join(', ');
		}

		// rentBumpsDollar are always yearly (https://compstak.atlassian.net/wiki/display/DATA/Rent+Bump+Years)
		if (value !== null && attribute.name === 'rentBumpsDollar') {
			value = money(value.bumps, currency) + "/" + (value.months / 12);
		}

		// rentBumpsPercent are similar to rentBumpsDollar (see above) - but the bump value is already a %
		if (value !== null && attribute.name === 'rentBumpsPercent') {
			value = value.bumps + "%/" + (value.months / 12);
		}

		// Some values are now sent as an array. No need to create a util function that only implements join
		if (['landlordRealtyBrokers', 'landlordRealtyCompanies', 'tenantRealtyBrokers', 'tenantRealtyCompanies'].indexOf(attribute.name) !== -1) {
			value = value.join(', ');
		}

		if (typeof value === 'number' && ['freeMonths', 'leaseTerm'].indexOf(attribute.name) !== -1) {
			value = months(value);
		}

		if (attribute.name === 'concessionsPercentage' && value < 1) {
			value = percent(value);
		}

		// Also, years are a special case, we want to see 1930 not 1,930 as the year
		if ((typeof value === 'number' && ['buildingYear', 'buildingYearRenovated'].indexOf(attribute.name) === -1)) {
			value = number(value);
		}

		if (value && attribute.preUnit) {
			if (attribute.preUnit === '$' || attribute.preUnit === '£') {
				value = money(value, currency);
			} else {
				value = attribute.preUnit + value;
			}
		}
		if (value && attribute.postUnit) {
			value = value + attribute.postUnit;
		}

		return value;
	};

	exports.format = function (comp) {
		return attributes.list(comp.market).filter(function (attribute) {

			if (!comp.hasOwnProperty(attribute.name)) {
				return false;
			}

			if (!attribute.inCompDetailsScreen) {
				return false;
			}

			return true;
		})
		.map(function (attribute) {

			var value = comp[attribute.name];

			if (!comp.own) {
				if (attribute.name === 'transactionSize') {
					value = exports.obscureTransactionSize(value);
				}
			}

			if (value !== null) {
				value = exports.formatValue(attribute.name, value, comp.market);
			}

			return {
				name: attribute.name,
				displayName: attribute.displayName,
				value: value,
				valueExists: true,
				section: attribute.section,
				width: attribute.width,
				showLock: value === null
			};
		});
	};

	exports.displayMapping = function (comp, includeExists) {
		return exports.format(comp).reduce(function (acc, item) {
			acc[item.name] = item.value;
			if (includeExists) {
				acc[item.name+'Exists'] = item.valueExists;
			}
			return acc;
		}, R.clone(comp));
	};

	exports.sectionedMapping = function (comp) {
		return exports.format(comp).reduce(function (attrsBySection, attr) {

			if (!attrsBySection[attr.section]) {
				attrsBySection[attr.section] = [];
			}
			attrsBySection[attr.section].push(attr);

			return attrsBySection;
		}, {});
	};

	return exports;
});
