// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post'); // Assuming you have the userModel file
const userModel = require('../models/user'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
    _id: 'user_id',
    username: 'user1',
    email: 'user1@example.com',
    stories: [{ _id: 'story1', img: 'img1'}],
  };
  


describe('POST /getStories/:user_id', () => {
  it('should retrieve user stories', (done) => {
    // const postModelMock = {
    //   findOne: () => Promise.resolve(mockPost),
    // };

    const userModelMock = {
      findOne: () => ({
        populate: () => Promise.resolve(mockUser),
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
      .post('/getStories/user_id')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
    
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('message', true);
        expect(response.body).to.have.property('stories');
        expect(response.body.stories.stories).to.deep.equal(mockUser.stories);
        done();
      });
  });

  it('should handle errors during user stories retrieval', (done) => {
    const userModelMock = {
      findOne: () => ({
        populate: () => Promise.reject(new Error('Mocked error')),
      }),
    };

    Object.assign(userModel, userModelMock);

    chai.request(app)
      .post('/getStories/user_id')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        console.log('Res: ', response.body)
        expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
        expect(response.body).to.have.property('message', false);
        done();
      });

  })
});
