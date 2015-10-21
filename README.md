# Lease Formatter

This is a CLI tool, a webservice, or a NPM/RequireJS module for formatting leases.

## Installation

```
# for CLI/Webservice
npm install -g compstak/lease-format

# for Node
npm install compstak/lease-format

# for Bower
bower install compstak/lease-format
```

## Usage

### CLI

```
lease-format --locale=en_US "{\"startingRent\":23.34, \"transactionSize\":5000, \"concessionsPercentage\": 0.123, \"market\":\"Atlanta\"}"
```

### Webservice

```
lease-format --serve
```

The server will respond to POSTs to `/format`, `/withmeta`, and `/sectioned`

It will take the locale from the accept-language header. Default is the server's setting, probably en_US.

### Node/RequireJS
```
var leaseFormat = require('lease-format');

leaseFormat.format(lease, 'en_US'); // complete data, including meta
leaseFormat.displayMapping(lease, 'en_US'); // key->val pairs
leaseFormat.sectionedMapping(lease, 'en_US'); // key->val pairs sectioned into groups
```

## Contributing

### Requirements
```
npm install -g gulp
npm install -g webpack
npm install -g testem
```

### Running the tests
```
git clone git@github.com:compstak/lease-format
npm install
npm test
```

### Development
```
gulp
```
then visit http://localhost:7357/ in a web browser to have the tests auto reload as you work.
