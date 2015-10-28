(function(factory) {

    //AMD
    if(typeof define === 'function' && define.amd) {
        define([
			'json!./base.json',
			'json!./london.json'
        ], factory);

    //NODE
    } else if(typeof module === 'object' && module.exports) {
        module.exports = factory(
			require('./base'),
			require('./london')
		);
    }

})(function (base, london) {
    return {
        base: base,
        London: london
    };
});
