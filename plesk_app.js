const os = require('os');
const fs = require('fs');
const S3rver = require('./lib/s3rver');
const { fromEvent } = require('rxjs');
const { filter } = require('rxjs/operators');

const corsConfig = require.resolve('./example/cors.xml');
const websiteConfig = require.resolve('./example/website.xml');

const instance = new S3rver({
  port: 80,
  address: 'S3domain',
  silent: false,
  logfile: true,
  serviceEndpoint: 'S3domain',
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
  defaultAccessKeyId: 'S3RVER',
  defaultSecretAccessKey: 'S3RVER',
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
