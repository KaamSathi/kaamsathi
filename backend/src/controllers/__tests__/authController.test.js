const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

// Mock route for testing
app.get('/test', (req, res) => res.status(200).json({ message: 'ok' }));

describe('Sample backend test', () => {
  it('should return ok', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('ok');
  });
}); 