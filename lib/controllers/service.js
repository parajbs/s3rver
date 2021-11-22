'use strict';



/*
 * Operations on the Service
 * The following methods correspond to operations you can perform on the Amazon S3 service.
 * https://docs.aws.amazon.com/AmazonS3/latest/API/RESTServiceOps.html
 */

/**
 * GET Service
 * This implementation of the GET operation returns a list of all buckets owned by the authenticated
 * sender of the request.
 * {@link https://docs.aws.amazon.com/AmazonS3/latest/API/RESTServiceGET.html}
 */
exports.getService = async function getService(ctx) {
  let cid = '';
  let OwnerCanonicalUserId = ''; 
  let OwnerDisplayName = '';	
  let buckets = '';
  if (ctx.app.privatebuckets === true) {	
    if (!ctx.state.account) {
	  const S3Error = require('../models/error');
      ctx.logger.error('No AccountKeys specified or does not exist');
      throw new S3Error('NoAccountKeys', 'No AccountKeys specified or does not exist');
    };
    cid = ctx.state.account.id;
    OwnerCanonicalUserId = ctx.state.account.id;
    OwnerDisplayName = ctx.state.account.displayName;	  
    buckets = await ctx.store.listBucketsB(cid, '');	  
  } else {
	cid = '';
	OwnerCanonicalUserId = ctx.app.defaultAccountId;
	OwnerDisplayName = ctx.app.defaultAccountDisplayName;  
    buckets = await ctx.store.listBuckets();
  };	
	
  ctx.logger.info('Fetched %d buckets', buckets.length);
  ctx.body = {
    ListAllMyBucketsResult: {
      '@': { xmlns: 'http://doc.s3.amazonaws.com/2006-03-01/' },
      Owner: {
        ID: OwnerCanonicalUserId,
        DisplayName: OwnerDisplayName,
      },
      Buckets: {
        Bucket: buckets.map((bucket) => ({
          Name: bucket.name,
          CreationDate: bucket.creationDate.toISOString(),
        })),
      },
    },
  };
};
