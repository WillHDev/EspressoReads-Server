
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET, JWT_EXPIRY } = require('../config');

const User = require('../models/user-schema');
const Books = require('../models/book-schema');
const seedUsers = require('../seed-data/seed-users.json');
const seedBooks = require('../seed-data/seed-books.json');

chai.use(chaihttp);
const expect = chai.expect;


describe('/API/USERS endpoint', function(){
  let webToken;
  let user;

  before(function(){
    this.timeout(6000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.dropDatabase() );
  });

  beforeEach(function(){
    this.timeout(6000);
    return User.insertMany(seedUsers)
      .then(insertedUsers => {
        user = insertedUsers[0];
        webToken = jwt.sign({user}, JWT_SECRET, {
          subject: user.username,
          expiresIn: JWT_EXPIRY,
          algorithm: 'HS256'
        });
      })
      .then(() => Books.insertMany(seedBooks));
  });

  afterEach(function(){
    return mongoose.connection.db.dropDatabase();
  });

  after(function(){
    return mongoose.disconnect();
  });


  describe('POST to /api/login', function(){
    it('should return a json web token if valid credentials are provided', function(){
      const dummyUsername = 'prudenceThePrune';
      const dummyPassword = 'prudence12';

      return chai.request(app).post('/api/users')
        .set('Accept', 'application/json')
        .send({username: dummyUsername, password: dummyPassword})
        .then( () => {
          return chai.request(app).post('/api/login')
            .set('Accept', 'application/json')
            .send({username: dummyUsername, password: dummyPassword});
        })
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.body).to.contain.keys('authToken');
          expect(apiRes.status).to.equal(200);
          const token = apiRes.body.authToken;
          return chai.request(app).get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');
        })
        .then(userData => {
          expect(userData).to.be.json;
          expect(userData.ok).to.equal(true);
          expect(userData.body.username).to.equal(dummyUsername);
        });
    });

    it('should return error if username does not exist', function(){
      const dummyUsername = 'NotARe@lUseRnAme';
      const dummyPassword = 'doesntmatter';

      return chai.request(app).post('/api/login')
        .set('Accept', 'application/json')
        .send({username: dummyUsername, password: dummyPassword})
        .then(apiRes => {
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.unauthorized).to.equal(true);
          expect(apiRes.body).to.deep.equal({});
          expect(apiRes.status).to.equal(401);
        });
    });

    it('should return error if password is not correct', function(){
      const dummyUsername = 'prudenceThePrune';
      const dummyPassword = 'prudence12';

      return chai.request(app).post('/api/users')
        .set('Accept', 'application/json')
        .send({username: dummyUsername, password: dummyPassword})
        .then( () => {
          return chai.request(app).post('/api/login')
            .set('Accept', 'application/json')
            .send({username: dummyUsername, password: 'NOTcorrectPASSWORD'});
        })
        .then(apiRes => {
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.unauthorized).to.equal(true);
          expect(apiRes.body).to.deep.equal({});
          expect(apiRes.status).to.equal(401);
        });
    });
  });



  describe('POST to /api/login/refresh', function(){
    it('should send a new token if valid token is provided', function(){
      return chai.request(app).post('/api/login/refresh')
        .set('Authorization', `Bearer ${webToken}`)
        .set('Content-Type', 'application/json')
        .then(apiRes => {
          expect(apiRes).to.be.json;
          expect(apiRes.ok).to.equal(true);
          expect(apiRes.status).to.equal(200);
          expect(apiRes.body).to.contain.keys('authToken');
          return chai.request(app).get('/api/users')
            .set('Authorization', `Bearer ${apiRes.body.authToken}`)
            .set('Content-Type', 'application/json');
        })
        .then(res => {
          expect(res.ok).to.equal(true);
          expect(res.status).to.equal(200);
        });
    });

    it('should not send new token if invalid token is provided', function(){
      return chai.request(app).post('/api/login/refresh')
        .set('Authorization', `Bearer ${webToken}a`)
        .set('Content-Type', 'application/json')
        .then(apiRes => {
          expect(apiRes.ok).to.equal(false);
          expect(apiRes.status).to.equal(401);
          expect(apiRes.body).to.deep.equal({});
        });
    });
  });
});