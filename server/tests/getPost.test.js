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
  likes: ['authenticatedUserId'],
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

// Your getPost route with authentication middleware
app.post("/getPost/:post_id", authenticateMiddleware, async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.userId.toString() });
    const postId = req.params.post_id;
    const post = await postModel.findOne({ _id: postId.toString() });
    let liked = false,
      saved = false;
    if (post && post.likes.includes(user._id.toString())) {
      liked = true;
    }
    if (user && user.saved.includes(post._id)) {
      saved = true;
    }
    res.json({ liked, saved, post });
  } catch (err) {
    res.json({ message: false });
    // console.log("/getPost: ", err);
  }
});

describe('POST /getPost/:post_id', () => {
  beforeEach(() => {
    // Reset the findOne stubs before each test
    userModel.findOne.resetHistory();
    postModel.findOne.resetHistory();
  });

  it('should retrieve post details with like and save status', async () => {
    const response = await chai.request(app)
      .post('/getPost/post1')
      .send();

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('liked', true);
    expect(response.body).to.have.property('saved', true);
    expect(response.body).to.have.property('post');
    expect(response.body.post).to.deep.equal(mockPost);

    // Ensure the userModel.findOne method was called with the correct parameters
    expect(userModel.findOne.calledOnce).to.be.true;
    expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.calledOnce).to.be.true;
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });
  });

  it('should handle errors during post details retrieval', async () => {
    // Force an error during post details retrieval
    postModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/getPost/post1');

    expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
    expect(response.body).to.have.property('message', false);
  });
});
