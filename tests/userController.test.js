// src/controllers/userController.test.js
const request = require('supertest');
const app = require('../app'); // Assuming you have an Express app set up in app.js
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Mock the User model
jest.mock('../src/models/userModel');

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash(mockUserData.password, 10);
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValueOnce(true),
        username: mockUserData.username,
        email: mockUserData.email,
        password: hashedPassword
      }));

      const response = await request(app)
        .post('/register')
        .send(mockUserData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully.' });
    });

    it('should return an error if registration fails', async () => {
      const mockUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      User.mockImplementation(() => ({
        save: jest.fn().mockRejectedValueOnce(new Error('Database error'))
      }));

      const response = await request(app)
        .post('/register')
        .send(mockUserData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Registration failed.' });
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = await bcrypt.hash(mockUserData.password, 10);
      User.findOne = jest.fn().mockResolvedValueOnce({
        _id: 'userId',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/login')
        .send(mockUserData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 404 if user not found', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne = jest.fn().mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/login')
        .send(mockUserData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found.' });
    });

    it('should return 401 for invalid credentials', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne = jest.fn().mockResolvedValueOnce({
        _id: 'userId',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/login')
        .send(mockUserData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid credentials.' });
    });

    it('should return 500 if login fails', async () => {
      const mockUserData = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      const response = await request(app)
        .post('/login')
        .send(mockUserData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Login failed.' });
    });
  });
});

