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

const uploadFile = async(file) => {
    console.log('In upload')
    const params = {
        Bucket: credentials.bucketName,
        Key: file.name,
        Body: file.data
    };
    
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if(err) {
                console.log('In Err')
                // throw err
                reject('Eroor uploading')
                console.log('Error: ', err)
            }
            
            else {
                console.log('Data Location: ', data.Location)
                resolve(data.Location)
            }        
        })
    }) 
}

module.exports = uploadFile