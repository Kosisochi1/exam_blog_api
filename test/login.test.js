const supertest = require('supertest');
const { connect } = require('./database');
const app = require('../app');
const UserModel = require('../model/userModel');
// Test Suit
describe('Login User', () => {
	let connection;
	beforeAll(async () => {
		connection = await connect();
	});
	beforeEach(async () => {
		connection.cleanup();
	});
	afterAll(async () => {
		connection.disconnect();
	});
	it('It should find User', async () => {
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
		expect(response.status).toEqual(200);
		expect(response.body).toMatchObject({
			massage: 'Login successfull',
			data: expect.any(Object),
		});
	});

	// check password
	it('It should Check Password ', async () => {
		await UserModel.create({
			first_name: 'kosiOnyi',
			last_name: 'kosi',
			email: 'onyiO@gmail.com',
			password: 'kosi',
		});
		const response = await supertest(app)
			.post('/v1/user/login')
			.set('content-type', 'application/json')
			.send({ email: 'onyiO@gmail.com', password: 'kos' });
		expect(response.status).toEqual(401);
		expect(response.body).toMatchObject({
			massage: 'Incorrect email or Password',
		});
	});
	// Find User
	it('It should find User ', async () => {
		await UserModel.create({
			first_name: 'kosiOnyi',
			last_name: 'kosi',
			email: 'onyiO@gmail.com',
			password: 'kosi',
		});
		const response = await supertest(app)
			.post('/v1/user/login')
			.set('content-type', 'application/json')
			.send({ email: 'aaonyiO@gmail.com', password: 'kosi' });
		expect(response.status).toEqual(404);
		expect(response.body).toMatchObject({
			massage: 'User not Found',
		});
	});
});
