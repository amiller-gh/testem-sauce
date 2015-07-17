require('colors');
var Runner = require('sauce-tap-runner');
var wdRunner = require('wd-tap-runner')
var wd = require('wd');
var saucie = require('saucie');
var program = require('commander');
var results = require('sauce-results');

var SAUCE_URL = 'ondemand.saucelabs.com',
    SAUCE_PORT = 80;
    SAUCE_USERNAME = process.env.SAUCE_USERNAME,
    SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;

program
  .option('-b, --browser [browser]', 'The browser', 'Chrome')
  .option('-v, --version [version]', 'The version', 'latest')
  .option('-p, --platform [platform]', 'The platform', 'Windows 7')
  .option('-r, --resolution [resolution]', 'The screen resolution', '1280x1024')
  .option('-o, --orientation [orientation]', 'The screen orientation', 'landscape')


  .parse(process.argv);

console.log('Running:', program.browser, program.version, program.platform)

var options = {
  name: 'Custom Job Name',
  browserName: program.browser,
  version: program.version,
  platform: program.platform,
  screenResolution: program.resolution,
  deviceOrientation: program.orientation,
  'tunnel-identifier': 'foobar100'
};

var JOB_ID;

var browser = wd.remote( {
  hostname: SAUCE_URL,
  port: SAUCE_PORT,
  user: SAUCE_USERNAME,
  pwd: SAUCE_ACCESS_KEY
}, 'promiseChain');

// optional extra logging
browser.on('status', function(info) {
  console.log(info.cyan);
});
browser.on('command', function(eventType, command, response) {
  console.log(' > ' + eventType.cyan, command, (response || '').grey);
});
browser.on('http', function(meth, path, data) {
  console.log(' > ' + meth.magenta, path, (data || '').grey);
});

browser.init(options, function(err, response) {
  if (err) {
    return console.log('Browser init error', err);
  }
  console.log('Browser created', arguments);
  JOB_ID = response[0]
})
.get("http://localhost:8080", function(){
  console.log('Navigaed')
})
.waitForConditionInBrowser("document.body.children.length > 0", 10000)
.fin(function() {
  browser.sleep(5000).quit();
  results({
    user: SAUCE_USERNAME,
    key: SAUCE_ACCESS_KEY,
    job: JOB_ID,
    passed: true
  }, function(err, resp){
    console.log('Result Log Response', arguments);
  })
})
.done();

function runTests(browser){
  console.log('Running tests');
  wdRunner('', browser, {port: 8080}, function(err, results) {
    console.log('Closing browser')
    // Ignore error when closing browser
    browser.quit(function() {
        ran(err, results);
    });
  });
};

function ran(err, result){
  if(err){
    console.log('Error running tests!', err);
    return process.exit(1);
  }
  console.log('Results:', result)
  results({
    user: SAUCE_USERNAME,
    key: SAUCE_ACCESS_KEY,
    job: result.body.id,
    passed: result.body.passed
  })
}
//
// saucie({
// ,
//   connect: 0
// }, function(err, result){
//
//   console.log(arguments);
//
//   results({
//     user: SAUCE_USERNAME,
//     key: SAUCE_ACCESS_KEY,
//     job: result.body.id,
//     passed: result.body.passed
//   })
//
// })
