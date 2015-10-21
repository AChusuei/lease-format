var format = require('./format');

module.exports = function (program) {

	var lease;
	try {
		lease = JSON.parse(program.args[0]);
	} catch (e) {
		console.error('Unable to parse lease JSON. You may need to escape quotes.');
		console.error(e.message);
		process.exit(1);
	}

	var formatted;

	if (program.includeMeta) {
		formatted = format.format(lease);
	} else if (program.sectioned) {
		formatted = format.sectionedMapping(lease);
	} else {
		formatted = format.displayMapping(lease, program.includeExistential);
	}

	var stringified;
	if (program.prettyPrint) {
		stringified = JSON.stringify(formatted, null, 4);
	} else {
		stringified = JSON.stringify(formatted);
	}

	console.log(stringified);
};
