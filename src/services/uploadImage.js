const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.NEW_AWS_ACCESS_KEY,
  secretAccessKey: process.env.NEW_AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.BUCKET_NAME,
  ACL:'public-read'
});

const uploadFile = (filename, data, contentType) => {
  console.log('Subiendo...');
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(data, 'base64'),
      ContentEncoding: 'base64',
      ContentType: contentType
    }
    s3.upload(params, function(s3Err, data) {
        if(s3Err) {
          console.log(s3Err);
          reject(s3Err)
        }
        resolve(data)
    });
  });
}

module.exports = { uploadFile }