
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaihttp = require('chai-http');

const { TEST_DATABASE_URL } = require('../config');

const User = require('../models/user-schema');
const Books = require('../models/book-schema');
const seedUsers = require('../utils/seed-users.json');
const seedBooks = require('../utils/seed-books.json');

const {JWT_EXPIRY, JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
chai.use(chaihttp);
const expect = chai.expect;


describe('/API/Books endpoint', function(){
  let user;
  let token;
  before(function(){
    this.timeout(6000);
    return mongoose.connect(TEST_DATABASE_URL)
      .then( () => mongoose.connection.dropDatabase() );
  });

  beforeEach(function(){
    this.timeout(6000);
    return User.insertMany(seedUsers)
      .then((users)=>{
        user = users[0];
        token = jwt.sign({user}, JWT_SECRET, {
          subject: user.username,
          expiresIn: JWT_EXPIRY
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


  describe('get all books', function(){
    it('should return the correct number of books belonging to user', function(){
      const dbPromise = Books.find({userId: user.id});
      const apiPromise = chai.request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);
      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return a list with the correct fields', function () {
      const dbPromise = Books.find({userId: user.id});
      const apiPromise = chai.request(app)
        .get('/api/books')
        .set('Authorization', `Bearer ${token}`);
  
      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.include.all.keys('userId','id', 'title', 'description', 'subtitle', 'author', 'tags', 'podcasts', 'Url');
            expect(item.id).to.equal(data[i].id);
            expect(item.title).to.equal(data[i].title);
            expect(item.description).to.equal(data[i].description);
          });
        });
    });
  });



  describe('get book by id', function(){
    it('should return the correct book', function(){
      let data;
      return Books.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app)
            .get(`/api/books/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('userId','id', 'title', 'description', 'subtitle', 'author', 'tags', 'podcasts', 'Url');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.description).to.equal(data.description);
        });
    });

    it('should respond with a 404 for an id that does not exist', function () {
      // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
      return chai.request(app)
        .get('/api/books/DOESNOTEXIST')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });



  describe('post new book', function(){
    it('should create a new book and return it when given valid data', function(){
        const newBook = 
        { 
              userId: "000000000000000000000001",
              title: "Sapiens",
              subtitle:"A Brief History of the Future",
              
            author:"Yuval Harari",
              description: "This is a Quake Book",
              Url:"http://bit.ly/2E7TvIU",
              tags: [{"name":"quake", "id":"000000000000000000000001"}],
              podcasts: [{
                  name:"Waking Up with Sam Harris",
                  episode:"89",
                  segment: [{
                      start:"5m 36s"
                  }]
              }]
         
          };
      let res;
      return chai.request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(newBook)
        .then(_res => {
          res =_res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('userId','id', 'title', 'description', 'subtitle', 'author', 'tags', 'podcasts', 'Url');
          return Books.findOne({_id: res.body.id, userId: user.id});
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.description).to.equal(data.description);
        });
    });

    it('should return an error if missing title', function(){
      const newBook = { 
       
        subtitle:"A Brief History of the Future",
        
      author:"Yuval Harari",
        description: "This is a Quake Book",
        Url:"http://bit.ly/2E7TvIU",
        tags: [{"name":"quake", "id":"000000000000000000000001"}],
        podcasts: [{
            name:"Waking Up with Sam Harris",
            episode:"89",
            segment: [{
                start:"5m 36s"
            }]
        }]
   
    };
      return chai.request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send(newBook)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  });



  describe('put/edit book', function(){
    it('should update the book when given valid data', function(){
      const updateBook =    { 
       
        title: "Sapiens",
        subtitle:"A Brief History of the Future",
        
      author:"Yuval Harari",
        description: "This is a Quake Book",
        Url:"http://bit.ly/2E7TvIU",
        tags: [{"name":"quake", "id":"000000000000000000000001"}],
        podcasts: [{
            name:"Waking Up with Sam Harris",
            episode:"89",
            segment: [{
                start:"5m 36s"
            }]
        }]
   
    };
      let data;
      return Books.findOne({userId: user.id})
        .then(_data => {
          data= _data;
          return chai.request(app)
            .put(`/api/books/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateEvent);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('userId','id', 'title', 'description', 'subtitle', 'author', 'tags', 'podcasts', 'Url');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(updateBook.title);
          expect(res.body.description).to.equal(updateBook.description);
          expect(res.body.userId).to.equal(user.id);
        });
    });

    it('should return an error if missing title', function(){
      const updateBook = 
        {
        
        subtitle:"A Brief History of the Future",
        
      author:"Yuval Harari",
        description: "This is a Quake Book",
        Url:"http://bit.ly/2E7TvIU",
        tags: [{"name":"quake", "id":"000000000000000000000001"}],
        podcasts: [{
            name:"Waking Up with Sam Harris",
            episode:"89",
            segment: [{
                start:"5m 36s"
            }]
        }]
        };
  
      return Books.findOne({userId: user.id})
        .then(data => {
          return chai.request(app)
            .put(`/api/books/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateEvent);
        })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
    
    it('should respond with 404 for id that does not exist', function(){
      const updateEvent = 
        {
          userId: user.id,
          title: 'Italian Night',
          description: 'Pizza for all!',
          draft:'false',
          location: {latitude: 39.7392, longitude: -104.9903},
          locationCity: {city: 'Denver', state: 'CO'},
          scheduleOptions: [ 
            {date: 'Mon, Sep 17, 2018 11:47 AM', votes: 0},
            {date: 'Thu, Oct 18, 2018 6:47 PM', votes: 0},
            {date: 'Tue, Oct 30, 2018 5:30 PM', votes: 0}
          ],
          restaurantOptions: [
            {
              yelpId: '16973602',
              website: 'https://www.zomato.com/denver/root-down-the-highlands?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1',
              name: 'Root Down',
              votes: 0
            },
            {
              yelpId: '16970329',
              website: 'https://www.zomato.com/denver/my-brothers-bar-lodo?utm_source=api_basic_user&utm_medium=api&utm_campaign=v2.1',
              name: 'My Brother\'s Bar',
              votes: 0
            }
          ],
          activityOptions: [
            {
              ebId: '41090701394',
              link: 'https://www.eventbrite.com/e/kids-crossfit-ages-4-to-17-tickets-41090701394?aff=ebapi',
              title: 'Kids CrossFit - Ages 4 to 17!',
              description:'get swole!',
              start: '',
              end: '',
              votes: 0
            },
            {
              ebId:'49111123693',
              link:'https://www.eventbrite.com/e/open-mat-jiu-jitsu-all-levels-tickets-49111123693?aff=ebapi',
              title:'Open Mat Jiu Jitsu - ALL Levels',
              description: 'Hi - ya!',
              start: '',
              end: '',
              votes:0
            }
          ]
        };
      return chai.request(app)
        .put('/api/books/DOESNOTEXIST')
        .set('Authorization', `Bearer ${token}`)
        .send(updateEvent)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });



  describe('delete Book', function(){
    it('should delete book and respond with 204', function(){
      let data;
      return Books.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app)
            .delete(`/api/books/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Books.count({ _id: data.id });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });
  });
});