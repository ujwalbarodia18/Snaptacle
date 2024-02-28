const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); 
const postModel = require('../models/post.model'); 
const userModel = require('../models/user.model'); 
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  _id: 'authenticatedUserId',
  username: 'user1',
  email: 'user1@example.com',
  saved: ['post1'],
};

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  content: 'Sample content 1',
  likes: ['authenticatedUserId'],
};

describe('/getPost/postId route', () => {
  it('should retrieve post details with like and save status', (done) => {
    const postModelMock = {
      findOne: () => Promise.resolve(mockPost),
    };

    const userModelMock = {
      findOne: () => Promise.resolve(mockUser)
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
      .post('/getPost/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('liked', true);
        expect(response.body).to.have.property('saved', true);
        expect(response.body).to.have.property('post');
        expect(response.body.post).to.deep.equal(mockPost);
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
