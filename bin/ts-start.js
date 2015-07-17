#!/usr/bin/env node
var Launcher = require('sauce-connect-launcher');
var program = require('commander');
var path = require('path');
var touch = require("touch");

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

var opts = {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      verbose: true,
      logger: function(message) {
        console.log(message)
      },
      pidfile: path.join(home, 'sc_client.pid'),
      tunnelIdentifier: 'foobar100'
    };

if (process.env.TRAVIS_JOB_NUMBER) {
  opts.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
}

touch.sync(opts.pidfile);

console.log(opts.pidfile)

var p = process

Launcher(opts, function(err, sauceConnectProcess) {
  if (err) {
    console.error(err.message);
    return;
  }
  sauceConnectProcess.kill = function NOOP() {};

  console.log("Sauce Connect ready");
  p.exit();

});
