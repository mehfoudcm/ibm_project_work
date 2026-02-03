// src/services/userService.test.js
const User = require('../models/userModel');
const userService = require('./userService');

// Mock the User model
jest.mock('../models/userModel');

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserById', () => {
    it('should return a user when a valid ID is provided', async () => {
      const mockUserId = '12345';
      const mockUser = { _id: mockUserId, username: 'testuser', email: 'test@example.com' };

      // Mock the User.findById method
      User.findById.mockResolvedValue(mockUser);

      const user = await userService.findUserById(mockUserId);

      expect(user).toEqual(mockUser);
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return null when user is not found', async () => {
      const mockUserId = '12345';

      // Mock the User.findById method to return null
      User.findById.mockResolvedValue(null);

      const user = await userService.findUserById(mockUserId);

      expect(user).toBeNull();
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should handle errors thrown by the User model', async () => {
      const mockUserId = '12345';

      // Mock the User.findById method to throw an error
      User.findById.mockRejectedValue(new Error('Database error'));

      await expect(userService.findUserById(mockUserId)).rejects.toThrow('Database error');
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
    });
  });
});
