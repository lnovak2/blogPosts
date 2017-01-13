const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, openServer} = require('../server.js');

const should = chai.should();

chai.use(chaiHttp);

describe ('Blog Posts', function(){
	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should list blogs on GET', function(){
		return chai.request(app)
		 .get('/blogPosts')
		 .then(function(res){
		 	res.should.have.status(200);
		 	res.should.be.json;
		 	res.body.should.be.a('array');
		 	res.body.length.should.be.at.least(1);
		 	const expectedKeys = ['title', 'content', 'author', 'publishDate'];
		 	res.body.forEach(function(item){
		 		item.should.be.a('object');
		 		item.should.include.keys(expectedKeys);
		 	});
		 });
	});

	it('should add a blog post on POST', function(){
		const newItem = {title: 'The Life of Coffee', content: 'Short story about coffee',
						author: 'Yours Truly', publishDate: '2017'};
		return chai.request(app)
		 .post('/blogPosts')
		 .send(newItem)
		 .then(function(res){
		 	res.should.have.status(201);
		 	res.should.be.json;
		 	res.body.should.be.a('object');
		 	res.body.should.include.keys('title', 'content', 'author', 'publishDate');
		 	res.body.id.should.not.be.null;
		 	res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
		 });
	});

	it('should update a blog post on PUT', function(){
		const updateData = {
			title: 'foo';
			content: 'bizz';
			author: 'bar';
			publishDate: 'bang';
		};

		return chai.request(app)
		.get('/blogPosts')
		.then(function(res){
			updateData.id = res.body[0].id;

			return chai.request(app)
			 .put('/blogPosts')
			 .send(updateData)
		})

		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.should.be.a('object');
			res.should.deep.equal('updateData');
		});
	});

	it('should delete blog post on DELETE', function(){
		return chai.request(app)
		.get('/blogPosts')
		.then(function(res){
			return chai.request(app)
			 .delete(`/blogPosts/${res.body[0].id}`);
		})
		.then(function(res){
			res.should.have.status(204);
		});
	});
});