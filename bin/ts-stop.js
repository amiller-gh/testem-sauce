var Launcher = require('sauce-connect-launcher');
var fs = require('fs');
var path = require('path');
var RSVP = require('rsvp');

var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

var pidFile = path.join(home, 'sc_client.pid');

return new RSVP.Promise(function(resolve, reject) {
  fs.readFile(pidFile, function(err, content) {
    if (err) {
      return reject(err);
    }
    process.on('exit', function() {
      resolve();
    });
    process.kill(parseInt(content, 10), 'SIGINT');
  });
});
