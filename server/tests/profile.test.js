// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const sinon = require('sinon');
// const express = require('express');
// const mongoose = require('mongoose')
// const { describe, it, beforeEach, afterEach } = require('mocha');

// chai.use(chaiHttp);

// const { expect } = chai;

// // Mock user data for testing
// const mockUser = {
//   _id: 'authenticatedUserId',
//   username: 'user1',
//   email: 'user1@example.com',
//   posts: [{ _id: 'post1', image: 'img1', caption: 'caption', user: 'user1', content: 'Sample content 1', likes: ['user1', 'user2'], tags: [], comments: [] }],
// };

// const userModel = {
//   findOne: sinon.stub(),
// };

// // Mock the userModel.findOne method to return the mockUser
// userModel.findOne.resolves(mockUser);

// // Mock authenticateMiddleware
// const authenticateMiddleware = (req, res, next) => {
//   // Simulate setting the userId in the request based on authentication
//   req.userId = 'authenticatedUserId';
//   next();
// };

// const app = express();
// app.use(express.json());

// // Your profile route with authentication middleware
// app.post("/profile", authenticateMiddleware, async (req, res) => {
//   try {
//     const userQuery = userModel.findOne({ _id: req.userId }, { password: 0 });
//     const user = await userQuery;
//     res.json({ user, own: true });
//   } catch (err) {
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// describe('POST /profile', () => {
//   beforeEach(() => {
//     // Reset the findOne stub before each test
//     userModel.findOne.resetHistory();
//   });

//   it('should retrieve user profile and posts', async () => {
//     const response = await chai.request(app)
//       .post('/profile')


//     expect(response).to.have.status(200);
//     expect(response.body).to.have.property('user');
//     expect(response.body.user).to.deep.equal({ _id: mockUser._id, username: mockUser.username, email: mockUser.email, posts: mockUser.posts });
//     expect(response.body).to.have.property('own', true);

//     // Ensure the userModel.findOne method was called with the correct parameters
//     expect(userModel.findOne.calledOnce).to.be.true;
//     expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });
//     expect(userModel.findOne.firstCall.args[1]).to.deep.equal({ password: 0 });
//   });

//   it('should handle errors during profile retrieval', async () => {
//     // Force an error during profile retrieval
//     userModel.findOne.rejects(new Error('Mocked error'));

//     const response = await chai.request(app)
//       .post('/profile')
//       .send();

//     expect(response).to.have.status(500);
//     expect(response.body).to.have.property('message', 'Internal Server Error');

//     // Ensure the userModel.findOne method was called with the correct parameters
//     expect(userModel.findOne.calledOnce).to.be.true;
//     expect(userModel.findOne.firstCall.args[0]).to.deep.equal({ _id: 'authenticatedUserId' });
//     expect(userModel.findOne.firstCall.args[1]).to.deep.equal({ password: 0 });
//   });
// });

