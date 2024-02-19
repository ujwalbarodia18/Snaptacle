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
  stories: [{ _id: 'story1', img: 'img1'}],
};

const userModel = {
  findOne: sinon.stub(),
};

// Mock the userModel.findOne method to return the mockUser
userModel.findOne.resolves(mockUser);

// Mock authenticateMiddleware
const authenticateMiddleware = (req, res, next) => {
  // Simulate setting the userId in the request based on authentication
  req.userId = 'authenticatedUserId';
  next();
};

const app = express();
app.use(express.json());

// Your getStories route with authentication middleware
app.post("/getStories/:user_id", authenticateMiddleware, async (req, res) => {
  try {
    const stories = await userModel
      .findOne({ _id: req.params.user_id }, { _id: 0 })
    res.json({ message: true, stories });
  } catch (err) {
    res.json({ message: false });
  }
});

describe('POST /getStories/:user_id', () => {
  beforeEach(() => {
    // Reset the findOne stub before each test
    userModel.findOne.resetHistory();
  });

  it('should retrieve user stories', async () => {
    const response = await chai.request(app)
      .post('/getStories/authenticatedUserId') // Assuming 'user1' is the sample user_id
      
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('message', true);
    expect(response.body).to.have.property('stories');
    expect(response.body.stories.stories).to.deep.equal(mockUser.stories);
  });

  it('should handle errors during user stories retrieval', async () => {
    // Force an error during user stories retrieval
    userModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/getStories/user1')
      .send();

      
    expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
    expect(response.body).to.have.property('message', false);
  });
});
