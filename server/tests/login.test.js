// profileRoute.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app'); // Replace with the actual path
const postModel = require('../models/post.model'); // Assuming you have the userModel file
const userModel = require('../models/user.model'); // Assuming you have the userModel file
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const sinon = require('sinon');
const sendMail = require('../sendMail')
const { RiXingLine } = require('@remixicon/react');


chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  username: 'user',
  email: 'user@gmail.com',
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


    bcrypt.compare.returns(true);
    sinon.stub
    
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
  it('should handle invalid credentials', (done) => {
    const userModelMock = {
      findOne: () => Promise.resolve(null)
    }


  // Override the userModel with the mock
    Object.assign(userModel, userModelMock);
    chai.request(app)
      .post('/login')
      .send({
        username: 'invalidUser',
        password: 'invalidPassword',
      })
      .end((err, response) => {
        console.log('Login err: ', err)
        console.log('Res Login Err: ', response.body)
        expect(response).to.have.status(401);
        expect(response.body).to.eql({ message: 'Invalid credentials' });
        done();
      });   

  })

});

describe('POST /verification', () => {
  it('should verify otp', (done) => {
    
    chai.request(app).post('/verification')
    .send({OTP: '1234'})
    .end((err, res) => {
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.be.a('boolean')
      done();
    })
  })
})
