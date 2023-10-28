const supertest = require('supertest');
const api = require('../app');
const { connect } = require('./database');
const UserMedel = require('../model/userModel');

describe('Test authenticatiion', () => {
	let connection;
	beforeAll(() => {
		connection = connect();
	});
	beforeEach(() => {
		connection.cleanup();
	});
	afterAll(() => {
		connection.disconnect();
	});
	// test case
	it('it should register a user successfully', async () => {
		const response = await supertest(api)
			.post('/v1/user/signup')
			.set('content-type', 'application/json')
			.send({
				first_name: 'kosiOnyi',
				last_name: 'kosi',
				email: 'onyiO@gmail.com',
				password: 'kosi',
			});
		expect(response.status).toEqual(201);
		expect(response.body.user).toMatchObject({
			first_name: 'kosiOnyi',
			last_name: 'kosi',
			email: 'onyiO@gmail.com',
			password: 'kosi',
		});
	});
});
