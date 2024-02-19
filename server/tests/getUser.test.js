const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

// Mock user data for testing
const mockUser = {
  _id: 'authenticatedUserId',
  username: 'user1',
  email: 'user1@example.com',
};

// Mock followers and following data
const mockFollowers = [
  { _id: 'follower1', username: 'follower1' },
  { _id: 'follower2', username: 'follower2' },
];

const mockFollowing = [
  { _id: 'following1', username: 'following1' },
  { _id: 'following2', username: 'following2' },
];

const userModel = {
  findOne: sinon.stub(),
};

// Mock the userModel.findOne method to return the mockUser with populated followers and following
userModel.findOne.resolves({
  ...mockUser,
  followers: mockFollowers,
  following: mockFollowing,
});

// Mock authenticateMiddleware
const authenticateMiddleware = (req, res, next) => {
  // Simulate setting the userId in the request based on authentication
  req.userId = 'authenticatedUserId';
  next();
};

const app = express();
app.use(express.json());

// Your getUser route with authentication middleware
app.post("/getUser/:user_id", authenticateMiddleware, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ _id: req.params.user_id });
    res.json({ user });
  } catch (err) {
    // console.log("Error in /getUser/:user_id: ", err);
    res.status(500).json({ message: false });
  }
});

describe('POST /getUser/:user_id', () => {
  beforeEach(() => {
    // Reset the findOne stub before each test
    userModel.findOne.resetHistory();
  });

  it('should retrieve user with followers and following', async () => {
    const response = await chai.request(app)
      .post('/getUser/user1') // Assuming 'user123' is the sample user_id

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('user');

    const { user } = response.body;

    // Ensure the followers and following arrays are populated with the correct data
    expect(user.followers).to.deep.equal(mockFollowers);
    expect(user.following).to.deep.equal(mockFollowing);
  });

  it('should handle errors during user retrieval', async () => {
    // Force an error during user retrieval
    userModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/getUser/user1')
      .send();

    expect(response).to.have.status(500);
    expect(response.body).to.have.property('message', false);
  });
});
