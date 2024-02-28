// followRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');
chai.use(chaiHttp);
const expect = chai.expect;
const sinon = require('sinon')

const currUserMock = {
    _id: 'authenticatedUserId',
    username: 'user1',
    email: 'user1@example.com',
    following: [],
    followers: [],
    save: () => Promise.resolve(currUserMock)
    // posts: [{ _id: 'post1', image: 'img1', caption: 'caption', user: 'user1', content: 'Sample content 1', likes: ['user1', 'user2'], tags: [], comments: [] }],
}

const profileUserMock = {
  _id: 'profileUserId',
    username: 'profileUser',
    email: 'profileUser@example.com',
    following: [],
    followers: [],
    save: () => Promise.resolve(profileUserMock)
    // posts: [{ _id: 'post1', image: 'img1', caption: 'caption', user: 'user1', content: 'Sample content 1', likes: ['user1', 'user2'], tags: [], comments: [] }],
}

describe('/follow/:id route', () => {
  it('should follow a user', async () => {
    // Mock userModel.findOne function for current user
    const currentUserMockModel = {
      findOne: () => Promise.resolve(currUserMock)
    };

    // Mock userModel.findOne function for profile user
    const profileUserMockModel = {
        findOne: () => Promise.resolve(profileUserMock)
    };

    // const saveStub = sinon.stub(userModel.prototype, 'save');
    // saveStub.resolves(profileUserMock);

    // Override the userModel with the mocks
    Object.assign(userModel, profileUserMockModel);
    
    jwt.verify = (token, secret, callback) => {
      // Replace with a valid decoded token
      const decodedToken = { userId: 'authenticatedUser' };
      callback(null, decodedToken);
    };
    // Make the request to unfollow
    const response = await chai.request(app)
      .post('/follow/profileUserId') // Replace with the actual user ID
      .set('Authorization', 'validToken'); // Replace with a valid token
    
    console.log('REs: ', response.body)
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      message: true,
      following: 1, // Update with the expected following count after unfollowing
      followers: 1, // Update with the expected followers count after unfollowing
    });

    const response2 = await chai.request(app)
      .post('/follow/profileUserId') // Replace with the actual user ID
      .set('Authorization', 'validToken'); // Replace with a valid token
      console.log('Res2: ', response2.body)
      expect(response2.status).to.equal(200);
    expect(response2.body).to.deep.equal({
      message: false,
      following: 0, // Update with the expected following count after unfollowing
      followers: 0, // Update with the expected followers count after unfollowing
    });
  });

  // it('should follow a user', async () => {
  //   // Mock userModel.findOne function for current user
  //   const currentUserMock = {
  //     findOne: () => ({
  //       following: [], // Add any initial following users if necessary
  //       save: () => Promise.resolve(),
  //     }),
  //   };

  //   // Mock userModel.findOne function for profile user
  //   const profileUserMock = {
  //     findOne: () => ({
  //       followers: [], // Add any initial followers if necessary
  //       save: () => Promise.resolve(),
  //     }),
  //   };

  //   // Override the userModel with the mocks
  //   Object.assign(userModel, currentUserMock);

  //   // Make the request to follow
  //   const response = await chai.request(app)
  //     .post('/api/follow/userToFollowId') // Replace with the actual user ID
  //     .set('Authorization', 'validToken'); // Replace with a valid token

  //   expect(response.status).to.equal(200);
  //   expect(response.body).to.deep.equal({
  //     message: true,
  //     following: 1, // Update with the expected following count after following
  //     followers: 1, // Update with the expected followers count after following
  //   });
  // });

  // Add more tests for other cases
});

