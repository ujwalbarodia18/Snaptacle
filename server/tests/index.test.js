// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../app");
// const request = require("supertest");
// chai.use(chaiHttp);
// const { v4: uuidv4 } = require("uuid");
// const expect = chai.expect;
// const axios = require('axios')
// const jwt = require('jsonwebtoken');
// const userModel = require("../models/user.js");
// const postModel = require("../models/post.js");
// const storyModel = require("../models/story.js");
// const chatModel = require("../models/chat.js");
// const mongoose = require('mongoose')
// const sinon = require('sinon');
// const bcrypt = require('bcrypt');
// const fs = require('fs').promises;

// const auth = require('../routes/index.js')

// describe('Server testing', () => { 
//     // describe('Register and login route', () => {
//     //     // it('should register a new user and return a token', (done) => {
//     //     //     const uniqueName = uuidv4();

//     //     //     request(app).post('/register').send({username:uniqueName, name: uniqueName, password: uniqueName, email: uniqueName+'@gmail.com'})
//     //     //     .then((res) => {
//     //     //         expect(res).to.have.status(201);
//     //     //         expect(res.body).to.be.an('object');
//     //     //         expect(res.body).to.have.property('message').that.equals(true);
//     //     //         expect(res.body).to.have.property('token').that.is.a('string');
//     //     //         done();
//     //     //     })
//     //     //     .catch((err) => {
//     //     //         return done(err);
//     //     //     })
//     //     // });


        
//     // })

//     describe('POST /login', () => {
//         it('should return JWT token and user details on successful login', async () => {
//           // Mocking userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             username: 'mockUsername',
//             email: 'mock@example.com',
//             password: await bcrypt.hash('mockPassword', 10), // Simulating hashed password
//           });
      
//           // Mocking bcrypt.compare function to always return true
//           const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);
//           sinon.restore();
//           // Mocking jwt.sign function
//           const signStub = sinon.stub(jwt, 'sign').returns('mockToken');
      
//           // Making a request to the /login route
//           request(app).post('/login').send({ username: 'mockUsername', password: 'mockPassword' })
//           .then((response) => {
//             expect(response.status).to.equal(200);
//             expect(response.body.token).to.equal('mockToken');
//             expect(response.body.userId).to.equal('mockUserId');
//             expect(response.body.username).to.equal('mockUsername');
//             expect(response.body.email).to.equal('mock@example.com');
//           })
      
//           // Expectations
          
      
//           // Restore the original functions after the test
//           findOneStub.restore();
//           compareStub.restore();
//           signStub.restore();
//         });
      
//         it('should return 401 status on invalid credentials', () => {
//           // Mocking userModel.findOne function to simulate user not found
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves(null);
      
//           // Making a request to the /login route with invalid credentials
//           request(app).post('/login').send({ username: 'nonexistentUser', password: 'invalidPassword' })
//           .then((response) => {
//             expect(response.status).to.equal(401);
//             expect(response.body.message).to.equal('Invalid credentials');
//           })
      
//           // Expectations
          
      
//           // Restore the original function after the test
//           findOneStub.restore();
//         });
//     });

//     describe('Search route', () => {
//         it('In tag search', (done) => {
//             // const searchTag = 'boy';
//             request(app).post('/search/tags').send({searchTag:'horse'})
//             .then((res) => {
//                 expect(res.body).to.have.property('message').that.equals(true)
//                 expect(res.body).to.have.property('posts').that.is.a('array')
//                 done();
//             })
//             .catch((err) => {
//                 return done(err);
//             })
//         })
//     })

//     describe('POST /post/postId', () => {
//         it('should return a post with user populated', (done) => {
//             // Mock data for the post
//             const mockPost = {
//               _id: '65cde585f5fc360828f1881f',
//               user: {
//                 _id: 'mock_user_id',
//                 username: 'mockuser',
//               },
//               // ... other fields
//             }
//             const token = jwt.sign({ userId: 'mock_user_id' }, 'abcdefghijklmnopqrstuvwxyz');
//             // Mock postModel.findOne implementation
//             sinon.stub(postModel, 'findOne').resolves(mockPost);
        
//             // Make a request to the endpoint
//             request(app)
//               .post(`/post/${mockPost._id}`)
//               .send({authorization: token}) // Set a mock token or use a real token if needed
//                 .then((res) => {
//                     expect(res.body).to.have.property('post').that.exists;
//                     done();
//                 })
//                 .catch((err) => {
//                     return done(err)
//                 })
        
//             // Restore stubs
//             sinon.restore();
//         })
//     });

//     describe('POST /getPost/:post_id', () => {
//         it('should fail to return liked, saved, and post details as user is not authenticated', (done) => {
//             // Mock data for the user and post
//             const mockUser = {
//               _id: '65cdc1dd079201e75cd4ce30',
//             };
        
//             const mockPost = {
//               _id: '65cde581f5fc360828f18816',
//             };
  
//             const token = jwt.sign({ userId: mockUser._id }, 'abcdefghijklmnopqrstuvwxyz');
        
//             // Mock userModel.findOne implementation
//             sinon.stub(userModel, 'findOne').resolves(mockUser);
        
//             // Mock postModel.findOne implementation
//             sinon.stub(postModel, 'findOne').resolves(mockPost);
        
//             // Make a request to the endpoint
//             request(app)
//               .post(`/getPost/${mockPost._id}`)
//               .send({authorization: token}) // Set a mock token or use a real token if needed
//               .then((res) => {
//                   expect(res).to.have.status(200);
//                   expect(res.body).to.have.property('message').that.equals(false);
//                   done();
//               })
//               .catch((err) => {
//                   return done(err)
//               })
//             // Expectations
            
        
//             // Restore stubs
//             sinon.restore();
//           });

//         it('should return liked, saved, and post details as user is not authenticated', (done) => {
//           // Mock data for the user and post
//           const mockUser = {
//             _id: '65cdc1dd079201e75cd4ce40',
//             saved: ['mock_post_id'],
//           };
      
//           const mockPost = {
//             _id: '65cdc1dd079201e75cd4ce50',
//             likes: ['65cdc1dd079201e75cd4ce40'],
//           };

//           const token = jwt.sign({ userId: mockUser._id }, 'abcdefghijklmnopqrstuvwxyz');
      
//           // Mock userModel.findOne implementation
//           sinon.stub(userModel, 'findOne').resolves(mockUser);
      
//           // Mock postModel.findOne implementation
//           sinon.stub(postModel, 'findOne').resolves(mockPost);
      
//           // Make a request to the endpoint
//           request(app)
//             .post(`/getPost/${mockPost._id}`)
//             .send({authorization: token}) // Set a mock token or use a real token if needed
//             .then((res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body).to.have.property('liked');
//                 expect(res.body).to.have.property('saved');
//                 expect(res.body).to.have.property('post');
//                 done();
//             })
//             .catch((err) => {
//                 return done(err)
//             })
 
//           sinon.restore();
//         });
      
        
//     });

//     describe('POST /profile', () => {
//         it('should return user profile with status 200 when authenticated', async () => {
//             // Mocking jwt.verify function
//             const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//               // Simulate a successful verification with a userId
//               callback(null, { userId: 'mockUserId' });
//             });
        
//             // Mocking the userModel.findOne function
//             const findOneStub = sinon.stub(userModel, 'findOne').resolves({ _id: 'mockUserId', username: 'mockUsername', posts: [] });
        
//             // Making a request to the /profile route
//             request(app).post('/profile').send({ authorization: 'mockToken' })
//             .then((response) => {
//                 // Expectations
//                 expect(response.status).to.equal(200);
//                 expect(response.body.user._id).to.equal('mockUserId');
//                 expect(response.body.user.username).to.equal('mockUsername');
//                 expect(response.body.own).to.be.true;
//             })
        
            
        
//             // Restore the original functions after the test
//             verifyStub.restore();
//             findOneStub.restore();
//         });

//         it('should return 401 status when not authenticated',  () => {
//             // Mocking jwt.verify function to simulate authentication failure
//             const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//               // Simulate a failed verification
//               callback({ name: 'JsonWebTokenError' }, null);
//             });
        
//             // Making a request to the /profile route
//             request(app).post('/profile').send({ authorization: 'invalidToken' })
//             .then((response) => {
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })

            
//             // Expectations        
//             // Restore the original function after the test
//             verifyStub.restore();
//           });
//     })

//     describe('POST /profile/:id', () => {
//         it('should return user profile with status 200 when authenticated and following', (done) => {
          
//           // Mocking the userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             followers: ['followerId'], // Simulate that the user is being followed by the authenticated user
//             posts: []
//           });

//           console.log('User: ', findOneStub());
//           findOneStub().then((res) => console.log('User: ', res))

//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });

//           console.log('Verfiy Stub: ', verifyStub)

//           const mockToken = jwt.sign({ userId: 'mockUserId' }, "abcdefghijklmnopqrstuvwxyz");
//           console.log('Mocktoken: ', mockToken)
      
//           // Making a request to the /profile/:id route
//           request(app).post('/profile/mockUserId')
//           .set({ headers: {authorization: `Bearer ${mockToken}`} })
//           .then((response) => {
//             console.log('Res Profile: ', response.body)
//             expect(response.status).to.equal(200);
//             expect(response.body.currUser._id).to.equal('mockUserId');
//             expect(response.body.own).to.be.false;
//             expect(response.body.isFollowing).to.be.true;
//             done();
//           })
//           .catch((err) => {
//             done(err)
//           })

//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneStub.restore();
//         });
      
//         it('should return user profile with status 200 when authenticated and not following', () => {

//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking the userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             followers: ['otherFollowerId'], // Simulate that the user is not being followed by the authenticated user
//             posts: []
//           });
      
//           // Making a request to the /profile/:id route
//           request(app).post('/profile/mockUserId').send({ authorization: 'mockToken' })
//           .then((response) => {
//             expect(response.status).to.equal(200);
//             expect(response.body.currUser._id).to.equal('mockUserId');
//             expect(response.body.own).to.be.false;
//             expect(response.body.isFollowing).to.be.false;
//           })
      
//           // Expectations
          
      
//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneStub.restore();
//         });
      
//         it('should return 401 status when not authenticated',  () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /profile/:id route
//           request(app).post('/profile/mockUserId').send({ authorization: 'invalidToken' })
//           .then((response) => {
//             // Expectations
//             expect(response.status).to.equal(401);
//             expect(response.body.message).to.equal('Unauthorized');
//           })
      
          
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /follow/:id', () => {
//         // afterEach(() => {
//         //     sinon.restore();
//         // })
//         it('should successfully follow/unfollow a user with status 200 when authenticated', () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
          
//           // Mocking the userModel.findOne function for the authenticated user
//           const findOneStubCurrentUser = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             following: ['followingUserId'], // Simulate that the user is already following someone
//           });
//           sinon.restore();
//           // Mocking the userModel.findOne function for the profile user
//           const findOneStubProfileUser = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockProfileUserId',
//             followers: ['followerUserId'], // Simulate that the profile user already has a follower
//           });
      
//           // Making a request to the /follow/:id route to unfollow
//           request(app).post('/follow/mockProfileUserId').send({ authorization: 'mockToken' })
//           .then((response) => {
//             // Expectations for unfollowing
//             expect(response.status).to.equal(200);
//             expect(response.body.message).to.be.false;
//             expect(response.body.following).to.equal(0);
//             expect(response.body.followers).to.equal(0);
//           })
      
//           request(app).post('/follow/mockProfileUserId').send({ authorization: 'mockToken' })
//           .then((response) => {
//             // Expectations for unfollowing
//             expect(response.status).to.equal(200);
//             expect(response.body.message).to.be.true;
//             expect(response.body.following).to.equal(1);
//             expect(response.body.followers).to.equal(1);
//           })
          
//           // Making a request to the /follow/:id route to follow
//         //   const responseFollow = await request.post('/follow/mockProfileUserId').send({ authorization: 'mockToken' });
      
//           // Expectations for following
          
      
//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneStubCurrentUser.restore();
//           findOneStubProfileUser.restore();
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /follow/:id route
//           request(app).post('/follow/mockProfileUserId').send({ authorization: 'invalidToken' })
//           .then((response) => {
//             expect(response.status).to.equal(401);
//             expect(response.body.message).to.equal('Unauthorized');
//           })
      
//           // Expectations
          
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /getUser', () => {
//         it('should return user details with status 200 when authenticated', () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking the userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             username: 'mockUsername',
//             email: 'mock@example.com',
//           });
      
//           // Making a request to the /getUser route
//           request(app).post('/getUser').send({ authorization: 'mockToken' })
//           .then((response) => {
//             expect(response.status).to.equal(200);
//             expect(response.body.user).to.deep.equal({ userId: 'mockUserId' }); // Adjust this based on the actual response format
//           })
      
//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneStub.restore();
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /getUser route
//           request(app).post('/getUser').send({ authorization: 'invalidToken' })
//           .then((response) => {
//             expect(response.status).to.equal(401);
//             expect(response.body.message).to.equal('Unauthorized');
//           })
            
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /upload', () => {
//         it('should upload a file and create a new post with status 200 when authenticated', async () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             posts: [],
//           });
      
//           // Mocking uploadFile function
//           const uploadFileStub = sinon.stub().resolves('mockFileLocation');
      
//           // Mocking fs.promises.unlink function
//           const unlinkStub = sinon.stub(fs, 'unlink').resolves(); // Assume successful file removal
      
//           // Making a request to the /upload route
//           request(app).post('/upload')
//             .field('caption', 'Test Caption')
//             .field('tags[]', ['tag1', 'tag2'])
//             .attach('file', 'path/to/test/image.jpg') // Replace with the path to a test image file
//             .set('authorization', 'mockToken')
//             .then((response) => {
//                 expect(response.status).to.equal(200);
//                 expect(response.body.message).to.be.true;
//             })

      
//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneStub.restore();
//         //   uploadFileStub.restore();
//           unlinkStub.restore();
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /upload route
//           request(app).post('/upload')
//             .field('caption', 'Test Caption')
//             .field('tags[]', ['tag1', 'tag2'])
//             .attach('file', 'path/to/test/image.jpg') // Replace with the path to a test image file
//             .set('authorization', 'invalidToken')
//             .then((response) => {
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /editProfile', () => {
//         it('should edit the user profile with status 200 when authenticated',  () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking userModel.findOne function
//           const findOneStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             profileImg: 'mockOldImageLocation',
//             name: 'mockOldName',
//             bio: 'mockOldBio',
//             save: sinon.stub(),
//           });
      
//           // Mocking uploadFile function
//           const uploadFileStub = sinon.stub().resolves('mockNewImageLocation');
      
//           // Making a request to the /editProfile route
//           request(app).post('/editProfile')
//             .field('name', 'mockNewName')
//             .field('bio', 'mockNewBio')
//             .attach('file', 'path/to/test/newImage.jpg') // Replace with the path to a test image file
//             .set('authorization', 'mockToken')
//             .then((response) => {
//                 expect(response.status).to.equal(200);
//                 expect(response.body.message).to.be.true;
//             })
      
//             // Restore the original functions after the test
//             verifyStub.restore();
//             findOneStub.restore();
            
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /editProfile route
//           request(app).post('/editProfile')
//             .field('name', 'mockNewName')
//             .field('bio', 'mockNewBio')
//             .attach('file', 'path/to/test/newImage.jpg') // Replace with the path to a test image file
//             .set('authorization', 'invalidToken')
//             .then((response) => {
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })
//           verifyStub.restore();
//         });
//     });

//     describe('POST /addComment/:post_id', () => {
//         it('should add a comment to the post with status 200 when authenticated', async () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking userModel.findOne function
//           const findOneUserStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//           });
      
//           // Mocking postModel.findOne function
//           const findOnePostStub = sinon.stub(postModel, 'findOne').resolves({ 
//             _id: 'mockPostId',
//             comments: [],
//             save: sinon.stub(),
//           });
      
//           // Making a request to the /addComment/:post_id route
//           request(app).post('/addComment/mockPostId')
//             .send({ comment: 'Test comment' })
//             .set('authorization', 'mockToken')
//             .then((response) => {
//                 expect(response.status).to.equal(200);
//                 expect(response.body.message).to.be.true;
//                 expect(response.body.post.comments.length).to.equal(1);
//                 expect(response.body.post.comments[0].comment).to.equal('Test comment');
//                 expect(response.body.post.comments[0].user).to.equal('mockUserId');
//             })
      
//           // Expectations
//                     // Restore the original functions after the test
//           verifyStub.restore();
//           findOneUserStub.restore();
//           findOnePostStub.restore();
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /addComment/:post_id route
//           request(app).post('/addComment/mockPostId')
//             .send({ comment: 'Test comment' })
//             .set('authorization', 'invalidToken')
//             .then((response) => {
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })
      
//           // Expectations
          
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /getComments/:post_id', () => {
//         it('should retrieve comments for a post with status 200 when authenticated', async () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking postModel.findOne function
//           const findOnePostStub = sinon.stub(postModel, 'findOne').resolves({ 
//             _id: 'mockPostId',
//             comments: [
//               { comment: 'Comment 1', user: { _id: 'user1', name: 'User 1' } },
//               { comment: 'Comment 2', user: { _id: 'user2', name: 'User 2' } },
//             ],
//           });
      
//           // Making a request to the /getComments/:post_id route
//           request(app).post('/getComments/mockPostId')
//             .set('authorization', 'mockToken')
//             .then((response) => {
//                 expect(response.status).to.equal(200);
//                 expect(response.body.message).to.be.true;
//                 expect(response.body.comments.length).to.equal(2);
//                 expect(response.body.comments[0].comment).to.equal('Comment 1');
//                 expect(response.body.comments[0].user._id).to.equal('user1');
//                 expect(response.body.comments[0].user.name).to.equal('User 1');
//                 expect(response.body.comments[1].comment).to.equal('Comment 2');
//                 expect(response.body.comments[1].user._id).to.equal('user2');
//                 expect(response.body.comments[1].user.name).to.equal('User 2');
//             })
      
//           // Expectations
          
      
//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOnePostStub.restore();
//         });
      
//         it('should return 401 status when not authenticated', async () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /getComments/:post_id route
//           request(app).post('/getComments/mockPostId')
//             .set('authorization', 'invalidToken')
//             .then((response) => {
//                 // Expectations
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     describe('POST /feed', () => {
//         it('should fetch the user feed with status 200 when authenticated', () => {
//           // Mocking jwt.verify function
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a successful verification with a userId
//             callback(null, { userId: 'mockUserId' });
//           });
      
//           // Mocking userModel.findOne function
//           const findOneUserStub = sinon.stub(userModel, 'findOne').resolves({ 
//             _id: 'mockUserId',
//             password: 'mockPassword',
//             following: ['user1', 'user2'],
//           });
      
//           // Mocking postModel.find function
//           const findPostsStub = sinon.stub(postModel, 'find').resolves([
//             { _id: 'post1', user: { _id: 'user1' } },
//             { _id: 'post2', user: { _id: 'user2' } },
//             { _id: 'post3', user: { _id: 'user3' } },
//           ]);
      
//           // Mocking userModel.find function for users with stories
//           const findUsersWithStoriesStub = sinon.stub(userModel, 'find').resolves([
//             { _id: 'user1', stories: ['story1'] },
//             { _id: 'user2', stories: [] },
//             { _id: 'user3', stories: ['story3', 'story4'] },
//           ]);
      
//           // Making a request to the /feed route
//           request(app).post('/feed')
//             .set('authorization', 'mockToken')
//             .then((response) => {
//                 // Expectations
//                 expect(response.status).to.equal(200);
//                 expect(response.body.message).to.be.true;
//                 expect(response.body.user._id).to.equal('mockUserId');
//                 expect(response.body.posts.length).to.equal(2);
//                 expect(response.body.userWithStories.length).to.equal(2);
//                 expect(response.body.userWithStories[0]._id).to.equal('user1');
//                 expect(response.body.userWithStories[1]._id).to.equal('user3');
//             })

//           // Restore the original functions after the test
//           verifyStub.restore();
//           findOneUserStub.restore();
//           findPostsStub.restore();
//           findUsersWithStoriesStub.restore();
//         });
      
//         it('should return 401 status when not authenticated', () => {
//           // Mocking jwt.verify function to simulate authentication failure
//           const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//             // Simulate a failed verification
//             callback({ name: 'JsonWebTokenError' }, null);
//           });
      
//           // Making a request to the /feed route
//           request(app).post('/feed')
//             .set('authorization', 'invalidToken')
//             .then((response) => {
//                 // Expectations
//                 expect(response.status).to.equal(401);
//                 expect(response.body.message).to.equal('Unauthorized');
//             })          
      
//           // Restore the original function after the test
//           verifyStub.restore();
//         });
//     });

//     // describe('POST /getStories/:user_id', () => {
//     //     it('should fetch user stories with status 200 when authenticated', async () => {
//     //       // Mocking jwt.verify function
//     //       // const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//     //       //   // Simulate a successful verification with a userId
//     //       //   callback(null, { userId: 'mockUserId' });
//     //       // });

//     //       sinon.stub(auth, 'authenticateMiddleware')
//     //         .callsFake(function(req, res, next) {
//     //             return next({userId: 'mockUserId'});
//     //         });
      
//     //       // Mocking userModel.findOne function
//     //       const findOneUserStub = sinon.stub(userModel, 'findOne').resolves({ 
//     //         _id: 'mockUserId',
//     //         stories: ['story1', 'story2', 'story3'],
//     //       });
      
//     //       // Making a request to the /getStories/:user_id route
//     //       request(app).post('/getStories/mockUserId')
//     //         .set(authorization, 'mockToken')
//     //         .then((response) => {
//     //             console.log('Res Story: ', response.body)
//     //             // Expectations                
//     //             expect(response.status).to.equal(200);
//     //             expect(response.body.message).to.be.true;
//     //             expect(response.body.stories.length).to.equal(3);
//     //         })
//     //       // Restore the original functions after the test
//     //       verifyStub.restore();
//     //       findOneUserStub.restore();
//     //     });
      
//     //     it('should return 401 status when not authenticated', async () => {
//     //       // Mocking jwt.verify function to simulate authentication failure
//     //       const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//     //         // Simulate a failed verification
//     //         callback({ name: 'JsonWebTokenError' }, null);
//     //       });
      
//     //       // Making a request to the /getStories/:user_id route
//     //       request(app).post('/getStories/mockUserId')
//     //         .set('authorization', 'invalidToken')
//     //         .then((response) => {
//     //             // Expectations
//     //             expect(response.status).to.equal(401);
//     //             expect(response.body.message).to.equal('Unauthorized');
//     //         })
      
//     //       // Restore the original function after the test
//     //       verifyStub.restore();
//     //     });
//     // });

//     // describe('POST /like/:post_id', () => {
//     //     it('should toggle like status for a post with status 200 when authenticated', async () => {
//     //       // Mocking jwt.verify function
//     //       const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//     //         // Simulate a successful verification with a userId
//     //         callback(null, { userId: 'mockUserId' });
//     //       });
          
//     //       // Mocking userModel.findOne function
//     //       const findOneUserStub = sinon.stub(userModel, 'findOne').resolves({ 
//     //         _id: 'mockUserId',
//     //       });
      
//     //       // Mocking postModel.findOne function
//     //       const findOnePostStub = sinon.stub(postModel, 'findOne').resolves({ 
//     //         _id: 'mockPostId',
//     //         likes: ['user1', 'user2'],
//     //         save: sinon.stub(),
//     //       });
      
//     //       // Making a request to the /like/:post_id route
//     //       request(app).post('/like/mockPostId')
//     //         .set('authorization', 'mockToken')
//     //         .then((response) => {
//     //             // Expectations
//     //             expect(response.body).to.have.property('liked')
//     //             expect(response.status).to.equal(200);
//     //             expect(response.body.liked).to.be.true;
//     //         })
      
          
      
//     //       // Check if the like status is toggled
//     //       const post = await postModel.findOne({ _id: 'mockPostId' });
//     //     //   expect(post.likes.length).to.equal(3); // One more like added
      
//     //       // Making another request to toggle like status
//     //       request(app).post('/like/mockPostId')
//     //         .send({authorization: 'mockToken'})
//     //         .then((response) => {
//     //             // Expectations for the second request
//     //             expect(response.status).to.equal(200);
//     //             expect(response.body.liked).to.be.false;
//     //         })
      
//     //       // Check if the like status is toggled back
//     //       const postAfterUnlike = await postModel.findOne({ _id: 'mockPostId' });
//     //       expect(postAfterUnlike.likes.length).to.equal(2); // One like removed
      
//     //       // Restore the original functions after the test
//     //       verifyStub.restore();
//     //       findOneUserStub.restore();
//     //       findOnePostStub.restore();
//     //     });
      
//     //     // it('should return 401 status when not authenticated', async () => {
//     //     //   // Mocking jwt.verify function to simulate authentication failure
//     //     //   const verifyStub = sinon.stub(jwt, 'verify').callsFake((token, secret, callback) => {
//     //     //     // Simulate a failed verification
//     //     //     callback({ name: 'JsonWebTokenError' }, null);
//     //     //   });
      
//     //     //   // Making a request to the /like/:post_id route
//     //     //   request(app).post('/like/mockPostId')
//     //     //     .set('authorization', 'invalidToken')
//     //     //     .then((response) => {
//     //     //         // Expectations
//     //     //         expect(response.status).to.equal(401);
//     //     //         expect(response.body.message).to.equal('Unauthorized');
//     //     //     })
          
      
//     //     //   // Restore the original function after the test
//     //     //   verifyStub.restore();
//     //     // });
//     // });
// })

    
    