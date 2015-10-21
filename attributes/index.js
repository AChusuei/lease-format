(function(factory) {

    //AMD
    if(typeof define === 'function' && define.amd) {
        define([
			'lease-attributes/all'
        ], factory);

    //NODE
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory(
			require('./all')
		);
    }

})(function (attributesByMarket) {

	var listCache = {};
	var hashCache = {};
	var byIdCache = {};
	var exports = {};

	function createMarketAttributes (base, market) {
		var marketProps = market.reduce(function (acc, prop) {
			acc[prop.name] = prop;
			return acc;
		}, {});

		return base.map(function (prop) {
			return marketProps[prop.name] || prop;
		});
	}

	exports.list = function (marketName) {
		
		if (!listCache[marketName]) {
			if (!attributesByMarket[marketName]) {
				listCache[marketName] = attributesByMarket.base;
			} else {
				listCache[marketName] = createMarketAttributes(attributesByMarket.base, attributesByMarket[marketName]);
			}
		}

		return listCache[marketName];
	};

	exports.hash = function (marketName) {
		if (!hashCache[marketName]) {
			var list = exports.list(marketName);
			hashCache[marketName] = list.reduce(function (acc, prop) {
				acc[prop.name] = prop;
				return acc;
			}, {});
		}
		return hashCache[marketName];
	};

	exports.byId = function (marketName) {
		if (!byIdCache[marketName]) {
			var list = exports.list(marketName);
			byIdCache[marketName] = list.reduce(function (acc, prop) {
				acc[prop.id] = prop;
				return acc;
			}, {});
		}
		return byIdCache[marketName];
	};

	return exports;
});
