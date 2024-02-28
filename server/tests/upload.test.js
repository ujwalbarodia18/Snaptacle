// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { describe, it } = require('mocha');
// const app = require('../app');
// const postModel = require('../models/post.model');
// const userModel = require('../models/user.model');
// const jwt = require('jsonwebtoken');
// const AWS = require('aws-sdk');
// const sinon = require('sinon');
// const proxyquire = require('proxyquire');
// const uploadFile  = require('../upload');
// const uploadRoute = require('../routes/upload.route')

// const credentials = {
//     accessKey: process.env.AWS_ACCESS_KEY_ID,
//     secretKey: process.env.AWS_SECRET_ACCESS_KEY,
//     bucketName: process.env.S3_BUCKET
// }

// const s3 = new AWS.S3({
//     accessKeyId: credentials.accessKey,
//     secretAccessKey: credentials.secretKey
// });

// chai.use(chaiHttp);
// const expect = chai.expect;

// const mockFile = {
//     fileName: 'mockFile',
//     data: 'mockData'
// }

// const mockUser = {
//     _id: 'authenticatedUserId',
//     username: 'user1',
//     email: 'user1@example.com',
//     saved: [],
//   };
  
//   // Mock post data for testing
//   const mockPost = {
//     _id: 'post1',
//     content: 'Sample content 1',
//     likes: [],
//     comments: []
//   };

// //   const route = proxyquire('./routes/upload.route', {
// //     './upload': {
// //       someFunction: sinon.stub().resolves('Mocked result'),
// //     },
// //   });

// //   app.use('/', route);
// app.use('/', uploadRoute);

// describe('POST /upload', () => {
//   it('should upload a post', (done) => {
//     const someFunctionStub = sinon.stub().resolves('Mocked result');

//     // Replace the original function with the stub
//     const myStub = sinon.stub(uploadFile).resolve();
//     console.log('MyStub: ', myStub)
//     myStub.return((mockFile) => resolves(mockFile))
    
//     // myStub().then((res) => console.log('in temp', res));
//     myStub.return(someFunctionStub);
//     const postModelMock = {
//         findOne: () => ({
//             ...mockPost, save: () => Promise.resolve(),
//         }),
//     };

//     const userModelMock = {
//         findOne: () =>  Promise.resolve(mockUser),
//     }

//     const postSaveStub = sinon.stub(postModel.prototype, 'save');
//     postSaveStub.resolves(mockPost);

//     jwt.verify = (token, secret, callback) => {
//       // Replace with a valid decoded token
//       const decodedToken = { userId: 'authenticatedUser' };
//       callback(null, decodedToken);
//   };

//     Object.assign(userModel, userModelMock);
//     Object.assign(postModel, postModelMock);
//     // Object.assign(uploadFile, uploadFileMock);

//     chai.request(app)
//     .post('/upload')
//     .attach({
//         files: {
//             file: "/home/ujwal.b/Desktop/Snaptacle/server/public/images/uploads/8ea1a70b-5538-45ba-9c9c-2d0fadab7edbpexels-pixabay-358042.jpg"
//         }        
//       })

//     .set('Authorization', 'mockedToken')       
//       .end((err, response) => {
//         console.log('Res upload: ', response.body);
//         console.log('Err: ', err)
//         // expect(response.body).to.have.property('message');
//         // expect(response.body.message).to.be.true;
//         done();
//       });
//     // s3UploadStub.restore();
//     sinon.restore();
//   });
// });
