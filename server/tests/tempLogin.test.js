// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post'); // Assuming you have the userModel file
const userModel = require('../models/user'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const sinon = require('sinon');

chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  username: 'user',
  password: 'password'
};

describe('POST /login', () => {
  let bcryptCompareStub;
  beforeEach(() => {
    // Mock bcrypt.compare before each test
    bcryptCompareStub = sinon.stub(bcrypt, 'compare');
  });

  afterEach(() => {
    // Restore the original bcrypt.compare after each test
    bcryptCompareStub.restore();
  });

  // afterEach(() => {
  //   // Restore bcrypt.compare after each test
  //   bcrypt.compare.restore();
  // });
  it('should login a user and return a token', (done) => {

    const userModelMock = {
        findOne: () => Promise.resolve(mockUser)
    }

    // Override the userModel with the mock
    Object.assign(userModel, userModelMock);

    // jwt.verify = (token, secret, callback) => {
    //     // Replace with a valid decoded token
    //     const decodedToken = { userId: 'authenticatedUser' };
    //     callback(null, decodedToken);
    // };

    bcrypt.compare.returns(true);
    
    chai.request(app)
      .post('/login', {

      })
      .send({
        username: 'invalidUser',
        password: 'invalidPassword',
      })
      .end((err, response) => {
        // console.log('Res: ', response.body)
        // console.log('Post after save: ', mockUser)
        // console.log('Res: ', response.body)
        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('username', mockUser.username);
        done();
      });            
  });

  // bcryptCompareStub.restore();
  // it('should handle invalid credentials', (done) => {
  //   const userModelMock = {
  //     findOne: () => Promise.reject(new Error('Mock error'))
  //   }


  // // Override the userModel with the mock
  //   Object.assign(userModel, userModelMock);
  //   chai.request(app)
  //     .post('/login')
  //     .send({
  //       username: 'invalidUser',
  //       password: 'invalidPassword',
  //     })
  //     .end((err, response) => {

  //       console.log('Res Login Err: ', response.body)
  //       // console.log('Post after save: ', mockUser)
  //       // console.log('Res: ', response.body)
  //       expect(response).to.have.status(401);
  //       expect(response.body).to.eql({ message: 'Invalid credentials' });
  //       done();
  //     });   

  // })

});
