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

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  content: 'Sample content 1',
  likes: [],
};

const userModel = {
  findOne: sinon.stub(),
};

const postModel = {
  findOne: sinon.stub(),
  save: sinon.stub(),
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

// Your like route with authentication middleware
app.post("/like/:post_id", authenticateMiddleware, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userId });
    const post = await postModel.findOne({ _id: req.params.post_id });

    if (post.likes.includes(user._id)) {
      const idx = post.likes.indexOf(user._id);
      post.likes.splice(idx, 1);
    //   await post.save();
      res.json({ liked: false });
    } else {
      post.likes.push(user._id);
    //   await post.save();
      res.json({ liked: true });
    }
  } catch (err) {
    // res.json(err)
    res.status(500).json({ message: false});
  }
});

describe('POST /like/:post_id', () => {
  beforeEach(() => {
    // Reset the findOne and save stubs before each test
    userModel.findOne.resetHistory();
    postModel.findOne.resetHistory();
  });

  it('should toggle like status for a post', async () => {    
    const response = await chai.request(app)
      .post('/like/post1') // Assuming 'post1' is the sample post_id
    expect(mockPost.likes.length).to.equal(1);
    expect(response).to.have.status(200);
    expect(response.body.liked).to.be.true;

    expect(userModel.findOne.calledOnce).to.be.true;
    expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.calledOnce).to.be.true;
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });

    const res2 = await chai.request(app).post('/like/post1');

    expect(res2).to.have.status(200);
    expect(res2.body.liked).to.be.false;
    expect(mockPost.likes.length).to.equal(0);
  });

  it('should handle errors during like status update', async () => {
    // Force an error during like status update
    postModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/like/post1')
      .send();

    expect(response).to.have.status(500);
    expect(response.body).to.have.property('message', false);

    // Ensure the userModel.findOne method was called with the correct parameters
    expect(userModel.findOne.calledOnce).to.be.true;
    expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.calledOnce).to.be.true;
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });
  });
});
