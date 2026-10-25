const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const cors = require('cors');

let app, mongoServer, token, projectId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = express(); app.use(cors()); app.use(express.json());
  app.use('/api/auth', require('../routes/auth'));
  app.use('/api/projects', require('../routes/projects'));
  app.use('/api/bids', require('../routes/bids'));
  
  const reg = await request(app).post('/api/auth/register').send({ name:'Owner', email:'owner@test.com', password:'123456', role:'client' });
  token = reg.body.token;
});

afterAll(async () => { await mongoose.disconnect(); await mongoServer.stop(); });

describe('Projects CRUD', () => {
  test('5. Should create a project (CREATE)', async () => {
    const res = await request(app).post('/api/projects').set('x-auth-token', token).send({ title:'Logo Design', description:'Need logo', budget:5000 });
    expect(res.status).toBe(200); expect(res.body.title).toBe('Logo Design'); projectId = res.body._id;
  });

  test('6. Should get all projects (READ)', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200); expect(Array.isArray(res.body)).toBe(true);
  });

  test('7. Should edit own project (UPDATE)', async () => {
    const res = await request(app).put(`/api/projects/${projectId}`).set('x-auth-token', token).send({ title:'Logo Design Updated' });
    expect(res.status).toBe(200); expect(res.body.title).toBe('Logo Design Updated');
  });

  test('8. Should validate fields - fail without title', async () => {
    const res = await request(app).post('/api/projects').set('x-auth-token', token).send({ description:'No title', budget:100 });
    expect(res.status).toBe(400);
  });

  test('9. Should delete project (DELETE)', async () => {
    const res = await request(app).delete(`/api/projects/${projectId}`).set('x-auth-token', token);
    expect(res.status).toBe(200);
  });
});