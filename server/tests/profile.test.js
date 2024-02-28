// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
    _id: 'authenticatedUserId',
    username: 'user1',
    email: 'user1@example.com',
    posts: [{ _id: 'post1', image: 'img1', caption: 'caption', user: 'user1', content: 'Sample content 1', likes: ['user1', 'user2'], tags: [], comments: [] }],
  };

describe('/profile route', () => {
  it('should return user information', (done) => {
    const userModelMock = {
      findOne: () => ({
        populate: () => Promise.resolve(mockUser),
      }),
    };

    // Override the userModel with the mock
    Object.assign(userModel, userModelMock);
    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };

    chai.request(app)
      .post('/profile')
      .set('Authorization', 'mockedToken')
      .end((err, res) => {
        // console.log('Res: ', res.body)
        expect(res.status).to.equal(200);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.deep.equal({ _id: mockUser._id, username: mockUser.username, email: mockUser.email, posts: mockUser.posts });
        expect(res.body).to.have.property('own', true);
        done();
      });
  });

  
});
