const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

// Mock user data for testing
const mockUsers = [
  { _id: 'user1', username: 'user1', email: 'user1@example.com' },
  { _id: 'user2', username: 'user2', email: 'user2@example.com' },
];

const userModel = {
  find: sinon.stub(),
};

// Mock the userModel.find method to return the mockUsers
userModel.find.resolves(mockUsers);

// Mock authenticateMiddleware
const authenticateMiddleware = (req, res, next) => {
  // Simulate setting the userId in the request based on authentication
  req.userId = 'user_id';
  next();
};

const app = express();
app.use(express.json());

// Your search route with authentication middleware
app.post("/search", authenticateMiddleware, async (req, res) => {
  const users = await userModel.find({ _id: { $ne: req.userId } });
  res.json({ users });
});

describe('POST /search', () => {
  beforeEach(() => {
    // Reset the find stub before each test
    userModel.find.resetHistory();
  });

  it('should search for users and return results', async () => {
    const response = await chai.request(app)
      .post('/search');

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('users').to.be.an('array');
    expect(response.body.users).to.have.lengthOf(mockUsers.length);

    // Ensure the userModel.find method was called with the correct parameters
    expect(userModel.find.calledOnce).to.be.true;
    expect(userModel.find.firstCall.args[0]).to.deep.equal({ _id: { $ne: 'user_id' } });
  });
});
