// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockPost = {
    _id: 'post1',
    image: 'img',
    caption: 'Sample content 1',
    likes: ['id1', 'id2', 'id3'],
    user: { _id: 'user1', username: 'user1' },  
  };

describe('/profile route', () => {
  it('should return user information', (done) => {
    const postModelMock = {
      findOne: () => ({
        populate: () => Promise.resolve(mockPost),
      }),
    };

    // Override the userModel with the mock
    Object.assign(postModel, postModelMock);
    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };

    chai.request(app)
      .post('/post/post1')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('post');
        expect(response.body.post).to.deep.equal(mockPost);
        done();
      });
  });

  
});
