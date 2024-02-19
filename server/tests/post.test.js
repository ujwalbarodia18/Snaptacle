const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

// Mock post data for testing
const mockPost = {
  _id: 'post1',
  image: 'img',
  caption: 'Sample content 1',
  likes: ['id1', 'id2', 'id3'],
  user: { _id: 'user1', username: 'user1' },  
};

const postModel = {
  findOne: sinon.stub(),
};

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

// Your post route with authentication middleware
app.post("/post/:post_id", authenticateMiddleware, async (req, res) => {
  try {
    const post = await postModel
      .findOne({ _id: req.params.post_id.toString() })
    res.json({ post });
  } catch (err) {
    // console.log('Error in getting post: ', err);
    res.json({ post: null });
  }
});

describe('POST /post/:post_id', () => {
  beforeEach(() => {
    // Reset the findOne stub before each test
    postModel.findOne.resetHistory();
  });

  it('should retrieve post by ID and populate user', async () => {
    const response = await chai.request(app)
      .post('/post/post1')

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('post');
    expect(response.body.post).to.deep.equal(mockPost);

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.calledOnce).to.be.true;
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });
    // expect(postModel.findOne.firstCall.args[1]).to.deep.equal({});
  });

  it('should handle errors during post retrieval', async () => {
    // Force an error during post retrieval
    postModel.findOne.rejects(new Error('Mocked error'));

    const response = await chai.request(app)
      .post('/post/post1')
      .send();

    expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
    expect(response.body).to.have.property('post', null);

    // Ensure the postModel.findOne method was called with the correct parameters
    expect(postModel.findOne.calledOnce).to.be.true;
    expect(postModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'post1' });
  });
});
