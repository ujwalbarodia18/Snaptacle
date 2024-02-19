const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

// Mock post data for testing
const mockSavedPost = {
  _id: 'post1',
  content: 'Sample content 1',
};

// Mock user data for testing
const mockUser = {
  _id: 'authenticatedUserId',
  username: 'user1',
  email: 'user1@example.com',
  saved: [mockSavedPost],
};



const userModel = {
  findOne: sinon.stub(),
};

const postModel = {
  findOne: sinon.stub(),
};

// Mock the userModel.findOne method to return the mockUser
userModel.findOne.resolves(mockUser);
postModel.findOne.resolves(mockSavedPost);

// Mock authenticateMiddleware
const authenticateMiddleware = (req, res, next) => {
  // Simulate setting the userId in the request based on authentication
  req.userId = 'authenticatedUserId';
  next();
};

const app = express();
app.use(express.json());

// Your getSavedPost route with authentication middleware
app.post("/getSavedPost", authenticateMiddleware, async (req, res) => {
  try {
    const saved = await userModel
      .findOne({ _id: req.userId }, { saved: 1, _id: 0 })
    
    res.json({ message: true, saved });
  } catch (err) {
    res.status(500).json({ message: false });
  }
});

describe('POST /getSavedPost', () => {
  beforeEach(() => {
    // Reset the findOne stub before each test
    userModel.findOne.resetHistory();
  });

  it('should retrieve saved posts for a user', async () => {
    const response = await chai.request(app)
      .post('/getSavedPost')
      .send();

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('message', true);
    expect(response.body).to.have.property('saved');
  });

  it('should handle errors during saved posts retrieval', async () => {
    // Force an error during saved posts retrieval
    userModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/getSavedPost');

    expect(response).to.have.status(500);
    expect(response.body).to.have.property('message', false);
  });
});
