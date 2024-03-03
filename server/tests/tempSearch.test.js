// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUsers = [
    { _id: 'user1', username: 'user1', email: 'user1@example.com', posts:[], following: [], followers: [], profileImg: 'img1' },
    { _id: 'user2', username: 'user2', email: 'user2@example.com', posts: [], following: [], followers: [], profileImg: 'img2' },
];

describe('/search route', () => {
  it('should search for users and return results', (done) => {
    const userModelMock = {
      find: () => Promise.resolve(mockUsers),

    };

    // Override the userModel with the mock
    Object.assign(userModel, userModelMock);
    jwt.verify = (token, secret, callback) => {
        // Replace with a valid decoded token
        const decodedToken = { userId: 'authenticatedUser' };
        callback(null, decodedToken);
    };

    chai.request(app)
      .post('/search')
      .set('Authorization', 'mockedToken')
      .end((err, response) => {
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('users').to.be.an('array');
        expect(response.body.users).to.have.lengthOf(mockUsers.length);

        done();
      });
  });

  
});
