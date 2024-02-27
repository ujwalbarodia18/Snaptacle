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
    const params = {
        Bucket: credentials.bucketName,
        Key: fileName
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
