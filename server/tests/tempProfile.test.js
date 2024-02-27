// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const userModel = require('../models/user'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
    _id: 'user1',
    username: 'user1',
    email: 'user1@example.com',
    posts: [{ _id: 'post1', image: 'img1', caption: 'caption', user: 'user1', content: 'Sample content 1', likes: ['user1', 'user2'], tags: [], comments: [] }],
    followers: [],
    following: []
  };

describe('/profile/id route', () => {
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
      .post('/profile/user1')
      .set('Authorization', 'mockedToken')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('currUser');
        expect(res.body.currUser).to.deep.equal(mockUser);        
        done();
      });
  });

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
        console.log('Res profile: ', res.body)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.deep.equal(mockUser);        
        done();
      });
  });

  
  
});
