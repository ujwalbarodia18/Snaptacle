// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post'); // Assuming you have the userModel file
const userModel = require('../models/user'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  _id: 'authenticatedUserId',
  username: 'user1',
  email: 'user1@example.com',
  saved: [],
};

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  content: 'Sample content 1',
  likes: [],
};

describe('POST /save/:post_id', () => {
  it('should toggle save status for a post', (done) => {
    const postModelMock = {
        findOne: () => Promise.resolve(mockPost)
    };

    const userModelMock = {
        findOne: () => ({
            ...mockUser, save: () => Promise.resolve(),
        }),
    }

    // Override the userModel with the mock
    Object.assign(postModel, postModelMock);
    Object.assign(userModel, userModelMock);

    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };
    
    chai.request(app)
      .post('/save/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('Res: ', response.body)
        // console.log('Post after save: ', mockUser)
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('saved');
        expect(response.body.saved).to.be.true;
        
      });
    
    Object.assign(postModel, postModelMock);
    Object.assign(userModel, userModelMock);

    chai.request(app)
      .post('/save/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('Res: ', response.body)
        // console.log('Post after save: ', mockUser)
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('saved');
        expect(response.body.saved).to.be.false;
        done();
    });
    
});

  it('should handle errors during post details retrieval', (done) => {
    const postModelMock = {
      findOne: () => Promise.reject(new Error('Mocked error')),
    };

    Object.assign(postModel, postModelMock);

    chai.request(app)
      .post('/getPost/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
        expect(response.body).to.have.property('message', false);
        done();
      });

  })
});
