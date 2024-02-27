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
const sendMail = require('../sendMail')
const { RiXingLine } = require('@remixicon/react');


chai.use(chaiHttp);
const expect = chai.expect;

const mockUser = {
  username: 'user',
  name: 'mockName',
  email: 'user@gmail.com',
  password: 'password'
};

describe('POST /registerTemp', () => {
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
  it('should register a new user and return a token', async() => {
    const saveStub = sinon.stub(userModel.prototype, 'save');
    saveStub.resolves(mockUser);
    
    try {
        const response = await chai.request(app)
      .post('/register')
      .send({
        username: mockUser.username,
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.password,
      });
      expect(response).to.have.status(201);
      expect(response.body).to.have.property('token');
    }
    catch(err) {
        console.log('Err: ', err)
    }
      
  });

});
