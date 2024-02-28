// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const jwt = require('jsonwebtoken');
const postModel = require('../models/post.model'); // Assuming you have the userModel file
const userModel = require('../models/user.model'); // Assuming you have the userModel file

chai.use(chaiHttp);
const expect = chai.expect;

const mockSavedPost = {
    _id: 'post1',
    content: 'Sample content 1',
  };

const mockUser = {
    _id: 'user_id',
    username: 'user1',
    email: 'user1@example.com',
    saved: [mockSavedPost],
};
  


describe('POST /getSavedPost', () => {
  it('should retrieve saved post', (done) => {
    const userModelMock = {
      findOne: () => ({
        populate: () => Promise.resolve(mockUser),
      }),
    }

    // Override the userModel with the mock
    Object.assign(userModel, userModelMock);


    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };

    chai.request(app)
      .post('/getSavedPost')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        console.log('Saved Post Res: ', response.body)
    
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message', true);
        expect(response.body).to.have.property('saved');
        
        done();
      });
  });

  it('should handle errors during getting saved post', (done) => {
    const userModelMock = {
      findOne: () => ({
        populate: () => Promise.reject(new Error('Mocked error')),
      }),
    };

    Object.assign(userModel, userModelMock);

    chai.request(app)
      .post('/getSavedPost')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        console.log('Res: ', response.body)
        expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
        expect(response.body).to.have.property('message', false);
        done();
      });

  })
});
