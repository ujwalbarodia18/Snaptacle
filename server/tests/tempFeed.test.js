// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const jwt = require('jsonwebtoken');
const postModel = require('../models/post'); // Assuming you have the userModel file
const userModel = require('../models/user'); // Assuming you have the userModel file

chai.use(chaiHttp);
const expect = chai.expect;

const mockSavedPost = {
    _id: 'post1',
    content: 'Sample content 1',
  };

const mockUser = {
    _id: 'user_id',
    username: 'user1',
    email: 'user1@example.com',
    following: ['user1', 'user2', 'user3']
};

const userWithStories = [
    {
        _id: 'user1',
        stories: ['story1', 'story4']
    },
    {
        _id: 'user2',
        stories: ['story2']
    },
    {
        _id: 'user3',
        stories: ['story3']
    }
]
  
const mockPosts = [
    {_id: 'post 1', image: 'img1', caption: 'caption1', user: {_id: 'user1'}},
    {_id: 'post 2', image: 'img2', caption: 'caption2', user: {_id: 'user2'}},
    {_id: 'post 3', image: 'img3', caption: 'caption3', user: {_id: 'user1'}},
    {_id: 'post 4', image: 'img4', caption: 'caption4', user: {_id: 'user3'}},
]


describe('POST /feed temp', () => {
  it('should retrieve posts and stories', (done) => {

    const userModelMock = {
        findOne: () => Promise.resolve(mockUser),
    }

    const postModelMock = {
      findOne: () => ({
        populate: () => ({
            sort: () => Promise.resolve(mockPosts)
        })
      }),
    }

    // Override the userModel with the mock
    Object.assign(userModel, userModelMock);
    Object.assign(postModel, postModelMock);

    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };

    chai.request(app)
      .post('/feed')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('posts').to.be.an('array');
        expect(response.body).to.have.property('user');
        
        done();
      });
  }).timeout(10000);

//   it('should handle errors during getting saved post', (done) => {
//     const userModelMock = {
//       findOne: () => ({
//         populate: () => Promise.reject(new Error('Mocked error')),
//       }),
//     };

//     Object.assign(userModel, userModelMock);

//     chai.request(app)
//       .post('/getSavedPost')
//       .set('Authorization', 'mockedToken')
//       .end((err, response) => {
//         console.log('Res: ', response.body)
//         expect(response).to.have.status(200); // Adjust the status code based on your error handling logic
//         expect(response.body).to.have.property('message', false);
//         done();
//       });

//   })
});
