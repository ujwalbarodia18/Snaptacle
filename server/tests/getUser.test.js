// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post.model'); // Assuming you have the userModel file
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');
const { populate } = require('dotenv');

chai.use(chaiHttp);
const expect = chai.expect;

const mockFollowers = [
    { _id: 'follower1', username: 'follower1' },
    { _id: 'follower2', username: 'follower2' },
];
  
const mockFollowing = [
  { _id: 'following1', username: 'following1' },
  { _id: 'following2', username: 'following2' },
];

const mockUser = {
    _id: 'user_id',
    username: 'user1',
    email: 'user1@example.com',
    stories: [{ _id: 'story1', img: 'img1'}],
    followers: mockFollowers,
    following: mockFollowing
  };


describe('POST /getUser/:user_id', () => {
  it('should retrieve user with followers and following', (done) => {
    // const postModelMock = {
    //   findOne: () => Promise.resolve(mockPost),
    // };

    const userModelMock = {
      findOne: () => ({
        populate: () => ({
            populate: () => Promise.resolve(mockUser)            
        })
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
      .post('/getUser/user_id')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('user');

        const { user } = response.body;
    // Ensure the followers and following arrays are populated with the correct data
        expect(user.followers).to.deep.equal(mockFollowers);
        expect(user.following).to.deep.equal(mockFollowing);
        done();
      });
  });

  it('should handle errors during user stories retrieval', (done) => {
    const userModelMock = {
        findOne: () => ({
          populate: () => ({
              populate: () => Promise.reject(new Error('Mocked Error'))            
          })
        }),
      }

    Object.assign(userModel, userModelMock);

    chai.request(app)
      .post('/getUser/user_id')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        console.log('Res: ', response.body)
        expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
        expect(response.body).to.have.property('message', false);
        done();
      });

  })
});
