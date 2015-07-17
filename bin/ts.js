#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .arguments('<cmd> [env]')
  .command('start', 'Start the sauce labs connection')
  .command('stop', 'Stop the sauce labs connection')
  .command('launch [options]', 'Lauch a browser')
  .parse(process.argv);
