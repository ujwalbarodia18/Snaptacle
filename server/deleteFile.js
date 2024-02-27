require("dotenv").config();
const AWS = require('aws-sdk');

const credentials = {
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.S3_BUCKET
}

const s3 = new AWS.S3({
    accessKeyId: credentials.accessKey,
    secretAccessKey: credentials.secretKey
});

const deleteFile = async (fileName) => {
    console.log('Credentials: ', credentials)
    console.log('S3: ', s3)
    const params = {
        Bucket: credentials.bucketName,
        Key: '473508be-38da-44c5-af42-83c45717f654pexels-biola-visuals-19376536.jpg'
    };

    return new Promise((resolve, reject) => {
        s3.deleteObject(params, (err, data) => {
            if (err) {
                console.error('Error deleting file from S3:', err);
                reject('Error deleting file from S3');
            } else {
                console.log('File deleted successfully from S3');
                resolve('File deleted successfully from S3');
            }
        });
    });
};

module.exports = deleteFile;
