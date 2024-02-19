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
  saved: ['post1'],
};

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  content: 'Sample content 1',
};

const userModel = {
  findOne: sinon.stub(),
};

const postModel = {
  findOne: sinon.stub(),
};

// Mock the userModel.findOne method to return the mockUser
userModel.findOne.resolves(mockUser);

// Mock the postModel.findOne method to return the mockPost
postModel.findOne.resolves(mockPost);

// Mock authenticateMiddleware
const authenticateMiddleware = (req, res, next) => {
  // Simulate setting the userId in the request based on authentication
  req.userId = 'authenticatedUserId';
  next();
};

const app = express();
app.use(express.json());

// Your save route with authentication middleware
app.post("/save/:post_id", authenticateMiddleware, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userId });
    const post = await postModel.findOne({ _id: req.params.post_id });

    if (user.saved.includes(post._id)) {
      const idx = user.saved.indexOf(post._id);
      user.saved.splice(idx, 1);
    //   await user.save();
      res.json({ saved: false });
    } else {
      user.saved.push(post._id);
    //   await user.save();
      res.json({ saved: true });
    }
  } catch (err) {
    // console.log("Error in /save/:post_id: ", err);
    res.status(500).json({ saved: false });
  }
});

describe('POST /save/:post_id', () => {
  beforeEach(() => {
    // Reset the findOne and save stubs before each test
    userModel.findOne.resetHistory();
    postModel.findOne.resetHistory();
  });

  it('should toggle save status for a post', async () => {
    const response = await chai.request(app)
      .post('/save/post1') // Assuming 'post1' is the sample post_id
      .send();

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('saved');
    expect(response.body.saved).to.be.false;
    expect(mockUser.saved.length).to.equal(0);

    // Ensure the userModel.findOne method was called with the correct parameters
    expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });

    const res2 = await chai.request(app)
        .post('/save/post1');

    expect(res2).to.have.status(200);
    expect(res2.body).to.have.property('saved');
    expect(res2.body.saved).to.be.true;
    expect(mockUser.saved.length).to.equal(1);
  });

  it('should handle errors during save status update', async () => {
    // Force an error during save status update
    userModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/save/post1');


    expect(response).to.have.status(500);
    expect(response.body.saved).to.be.false;
  });
});
