const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

const authenticateMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token.split(' ')[1], "abcdefghijklmnopqrstuvwxyz");
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const yourRouteHandler = async (req, res) => {
  // Mock user object (replace this with your actual user schema)
  const mockUser = {
    _id: 'fakeUserId',
    username: 'testUser',
    name: 'Test User',
    email: 'test@example.com',
  };

  // Use the same secret key for signing the token
  const secretKey = "abcdefghijklmnopqrstuvwxyz";

  const token = jwt.sign({ userId: mockUser._id }, secretKey, { expiresIn: "1h" });

  res.status(201).json({ message: true, token });

}

describe('POST /register', () => {
  let verifyStub;

  beforeEach(() => {
    verifyStub = sinon.stub(jwt, 'verify');
  });

  afterEach(() => {
    verifyStub.restore();
  });

  it('should register a new user and return a token', async () => {
    const app = express();
    app.use(authenticateMiddleware);
    app.post('/register', yourRouteHandler);

    // Stub the verify function to always return a decoded token
    verifyStub.returns({ userId: 'fakeUserId' });

    // Make the request without hitting the database
    const response = await chai.request(app)
      .post('/register')
      .set('Authorization', 'Bearer mockToken') // Use any string as a mock token
      .send({
        username: 'testUser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword',
      });
    
      // console.log('Res: ', response)

    // Assert the response
    expect(response).to.have.status(201);
    expect(response.body).to.have.property('token');
  });
});
