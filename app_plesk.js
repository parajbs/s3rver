const os = require('os');
const fs = require('fs');
const S3rver = require('./lib/s3rver');
const { fromEvent } = require('rxjs');
const { filter } = require('rxjs/operators');

const corsConfig = require.resolve('./example/cors.xml');
const websiteConfig = require.resolve('./example/website.xml');

const instance = new S3rver({
  address: process.env.S3address || '0.0.0.0',
  port: process.env.S3port || 80,
  key: undefined,
  cert: undefined,
  silent: false,
  logfile: true,
  serviceEndpoint: process.env.S3endpoint || 'S3domain',
  directory: './tmp/s3rver',
  resetOnClose: false,
  allowMismatchedSignatures: true,
  vhostBuckets: false,
  configureBuckets: [
    {
      name: 'conf_web',
      configs: [fs.readFileSync(corsConfig), fs.readFileSync(websiteConfig)],
    },
    {
      name: 'test-bucket',
    },
  ],
}).run((err, { address, port } = {}) => {
  if (err) {
    console.error(err);
  } else {
    console.log('now listening at address %s and port %d', address, port);
  }
});

const s3Events = fromEvent(instance, 'event');
s3Events.subscribe((event) => console.log(event));
s3Events
  .pipe(filter((event) => event.Records[0].eventName == 'ObjectCreated:Copy'))
  .subscribe((event) => console.log(event));