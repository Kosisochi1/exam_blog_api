const supertest = require('supertest');
const app = require('../app');
const { connect } = require('./database');
const UserModel = require('../model/userModel');

const BlogModel = require('../model/blogModel');

describe('Get All the Items', () => {
	let connection;
	let token;
	beforeAll(async () => {
		connection = await connect();
	});

	afterEach(async () => {
		await connection.cleanup();
	});
	afterAll(async () => {
		await connection.disconnect();
	});
	// it('It should return all Items', async () => {
	// 	const response = await supertest(app)
	// 		.get('/v1/allBlog')
	// 		.set('content-type', 'application/json');
	// 	expect(response.status).toEqual(200);
	// });
	it('It should return all Items', async () => {
		const response = await supertest(app)
			.get('/v1/allBlog')
			.set('content-type', 'application/json');
		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			massage: 'all blog list',
		});
	});
});
