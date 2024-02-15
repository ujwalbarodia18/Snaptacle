const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Assuming your Express app is exported from app.js
const request = require("supertest");
chai.use(chaiHttp);
const { v4: uuidv4 } = require("uuid");
const expect = chai.expect;
const axios = require('axios')

describe('Server testing', () => { 
    describe('Register and login route', () => {
        // it('should register a new user and return a token', (done) => {
        //     const uniqueName = uuidv4();

        //     request(app).post('/register').send({username:uniqueName, name: uniqueName, password: uniqueName, email: uniqueName+'@gmail.com'})
        //     .then((res) => {
        //         expect(res).to.have.status(201);
        //         expect(res.body).to.be.an('object');
        //         expect(res.body).to.have.property('message').that.equals(true);
        //         expect(res.body).to.have.property('token').that.is.a('string');
        //         done();
        //     })
        //     .catch((err) => {
        //         return done(err);
        //     })
        // });

        it('should login a user and return its user Id', (done) => {
            const validUser = 'user';
            // const res = await request(app).post('/login').send({username: validUser, password: validUser});
            // expect(res.body).to.have.property('token').that.is.a('string')
            // expect(res.body).to.have.property('userId').that.is.a('string')
            request(app).post('/login').send({username: validUser, password: validUser})
            .then((res) => {
                expect((res.body)).to.have.property('token').that.is.a('string')
                expect(res.body).to.have.property('userId').that.is.a('string')
                done();
            })
            .catch((err) => {
                return done(err)
            })            
        });

        it('should fail if a creadential are wrong for login', (done) => {
            const wrongUser = 'userrr';
            request(app).post('/login').send({username: wrongUser, password: wrongUser})
            .then((res) => {
                expect(res).to.have.status(401)
                done()
            })
            .catch((err) => {
                return done(err)
            })
            
        });
    })

    describe('Search route', () => {
        it('In tag search', (done) => {
            // const searchTag = 'boy';

            request(app).post('/search/tags').send({searchTag:'horse'})
            .then((res) => {
                expect(res.body).to.have.property('message').that.equals(true)
                expect(res.body).to.have.property('posts').that.is.a('array')
                done();
            })
            .catch((err) => {
                return done(err);
            })
        })
    })
})