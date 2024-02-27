const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post'); // Assuming you have the userModel file
const userModel = require('../models/user'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
    _id: 'authenticatedUserId',
    username: 'user1',
    email: 'user1@example.com',
    saved: [],
  };
  
  // Mock post data for testing
  const mockPost = {
    _id: 'post1',
    content: 'Sample content 1',
    likes: [],
    comments: []
  };

describe('POST /addComment/:post_id', () => {
  it('should add a comment to the post', (done) => {

    const postModelMock = {
        findOne: () => ({
            ...mockPost, save: () => Promise.resolve(),
        }),
    };

    const userModelMock = {
        findOne: () =>  Promise.resolve(mockUser),
    }

    // Stub the findOne methods of userModel and postModel
    const saveStub = sinon.stub(userModel.prototype, 'save');
    saveStub.resolves(mockUser);

    const postSaveStub = sinon.stub(postModel.prototype, 'save');
    postSaveStub.resolves(mockPost);

    jwt.verify = (token, secret, callback) => {
      // Replace with a valid decoded token
      const decodedToken = { userId: 'authenticatedUser' };
      callback(null, decodedToken);
  };

    Object.assign(userModel, userModelMock);
    Object.assign(postModel, postModelMock);

    chai.request(app)
      .post(`/addComment/${mockPost._id}`)
      .set('Authorization', 'mockedToken')
      .send({ comment: 'This is mockComment' })
      .end((err, response) => {
        console.log('Res comment: ', response.body);
        // expect(response).to.have.status(200);
        done();
      });

    sinon.restore();
  });
});
