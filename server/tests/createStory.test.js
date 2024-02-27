// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { describe, it } = require('mocha');
// const app = require('../app'); 
// const postModel = require('../models/post'); 
// const userModel = require('../models/user'); 
// const storyModel = require('../models/story');
// const jwt = require('jsonwebtoken');
// const sinon = require('sinon');
// // const sinonTimers = require('sinon-timers');
// chai.use(chaiHttp);
// const expect = chai.expect;
// // sinonTimers.useFakeTimers();


// const mockUser = {
//     _id: 'authenticatedUserId',
//     username: 'user1',
//     email: 'user1@example.com',
//     saved: [],
//     stories: []
//   };
  
//   // Mock post data for testing
//   const mockStory = {
//     _id: 'story1',
//     img: 'img1',
//     user: 'authenticatedUserId'
//   };

// describe('POST /createStory', () => {
//   it('should upload a story', (done) => {

//     const storyModelMock = {
//         findOne: () => ({
//             ...mockStory, save: () => Promise.resolve(),
//         }),
//     };

//     const userModelMock = {
//         findOne: () => ({
//             ...mockUser, save: () => Promise.resolve(mockUser)
//         })
//     }    

//     jwt.verify = (token, secret, callback) => {
//         // Replace with a valid decoded token
//         const decodedToken = { userId: 'authenticatedUser' };
//         callback(null, decodedToken);
//     };

//     const clock = sinon.useFakeTimers(50000);
//     const setTimeoutStub =  sinon.stub(global, 'setTimeout');  
//     setTimeoutStub.callsFake((callback) => callback());
    
//     // console.log('Timeout: ', setTimeoutStub);

//     Object.assign(userModel, userModelMock);
//     Object.assign(storyModel, storyModelMock);
//     chai.request(app)
//       .post(`/createStory`)
//       .set('Authorization', 'mockedToken')
//       .end((err, response) => {
//         console.log('Res story: ', response.body);
//         // expect(response).to.have.status(200);
//         done();
//       });
//   });
// });
