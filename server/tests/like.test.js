// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post.model'); // Assuming you have the userModel file
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  _id: 'authenticatedUserId',
  username: 'user1',
  email: 'user1@example.com',
};

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  content: 'Sample content 1',
  likes: [],
};

describe('POST /like/:post_id', () => {
  it('should toggle like status for a post', (done) => {
    const postModelMock = {
        findOne: () => ({
            ...mockPost, 
            save: () => Promise.resolve()
        })
    };

    const userModelMock = {
        findOne: () => Promise.resolve(mockUser),
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
      .post('/like/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('After Post: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('liked');
        expect(response.body.liked).to.be.true;
        // done();
    })
    // console.log('Here')
    Object.assign(postModel, postModelMock);
    Object.assign(userModel, userModelMock);

    chai.request(app)
      .post('/like/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        console.log('After Post: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('liked');
        expect(response.body.liked).to.be.false;
        done();
    })
    
});
});
