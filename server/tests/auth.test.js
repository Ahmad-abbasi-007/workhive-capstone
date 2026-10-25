const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cors = require('cors');

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = express(); app.use(cors()); app.use(express.json());
  app.use('/api/auth', require('../routes/auth'));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Flow', () => {
  test('1. Should register a client', async () => {
    const res = await request(app).post('/api/auth/register').send({ name:'Test Client', email:'client@test.com', password:'123456', role:'client' });
    expect(res.status).toBe(200); expect(res.body.token).toBeDefined();
  });

  test('2. Should register a freelancer', async () => {
    const res = await request(app).post('/api/auth/register').send({ name:'Ali Freelancer', email:'ali@test.com', password:'123456', role:'freelancer' });
    expect(res.status).toBe(200); expect(res.body.user.role).toBe('freelancer');
  });

  test('3. Should login with correct creds', async () => {
    const res = await request(app).post('/api/auth/login').send({ email:'client@test.com', password:'123456' });
    expect(res.status).toBe(200); expect(res.body.token).toBeDefined();
  });

  test('4. Should fail login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email:'client@test.com', password:'wrong' });
    expect(res.status).toBe(400);
  });
});