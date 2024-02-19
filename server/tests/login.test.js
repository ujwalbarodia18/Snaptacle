const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const express = require('express');
const { describe, it, beforeEach, afterEach } = require('mocha');

chai.use(chaiHttp);

const { expect } = chai;

// Mock user data for testing
const mockUser = {
  _id: 'fakeUserId',
  username: 'testUser',
  password: '$2b$10$Gkcsq3wDQm76X/PxIg/vLOfJtcI49.K4HQbQ97e/HK/EnWwk7DctC', // Hashed password
  email: 'test@example.com',
};

const userModel = {
  findOne: sinon.stub(),
};

// Mock the userModel.findOne method to return the mockUser
userModel.findOne.withArgs({ username: mockUser.username }).resolves(mockUser);

const app = express();
app.use(express.json());

// Your login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, "abcdefghijklmnopqrstuvwxyz", {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true });

  // Mock sendMail function to avoid actual email sending during the test
  const sendMail = sinon.stub();
  const OTP = sendMail(user.email);

  res.json({ token, userId: user._id, username: user.username, email: user.email, OTP });
});

describe('POST /login', () => {
  beforeEach(() => {
    // Reset the sendMail stub before each test
    sinon.stub(console, 'error').callsFake(() => {});
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should login a user and return a token', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({
        username: 'testUser',
        password: 'user', // This is the plaintext password corresponding to the hashed password in mockUser
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('userId', mockUser._id);
    expect(response.body).to.have.property('username', mockUser.username);
    expect(response.body).to.have.property('email', mockUser.email);
  });

  it('should handle invalid credentials', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({
        username: 'invalidUser',
        password: 'invalidPassword',
      });

    expect(response).to.have.status(401);
    expect(response.body).to.eql({ message: 'Invalid credentials' });
  });
});
