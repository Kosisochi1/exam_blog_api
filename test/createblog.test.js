const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../model/userModel');

const BlogModel = require('../model/blogModel');

// Test Suit
describe('Test for all published blog ', () => {
	let connection;
	let token;
	let id;
	beforeAll(async () => {
		connection = await connect();
	});
	beforeEach(async () => {
		await UserModel.create({
			first_name: 'kosiOnyi',
			last_name: 'kosi',
			email: 'onyiO@gmail.com',
			password: 'kosi',
		});
		const response = await supertest(app)
			.post('/v1/user/login')
			.set('content-type', 'application/json')
			.send({
				email: 'onyiO@gmail.com',
				password: 'kosi',
			});
		token = response.body.data.token;
	});
	afterEach(async () => {
		await connection.cleanup();
	});
	afterAll(async () => {
		await connection.disconnect();
	});
	it('It should create', async () => {
		const response = await supertest(app)
			.post('/v1/blog')
			.set('authorization', `Bearer ${token}`)
			.set('content-type', 'application/json')
			.send({
				title: ' The ',
				description: 'story of poor child',
				author: 'kosi',
				body: 'And his parents just died ',
				tags: 'drama',
			});

		expect(response.status).toEqual(200);
	});
});
