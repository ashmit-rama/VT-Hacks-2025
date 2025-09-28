const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/search
// @desc    Search users by username
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      username: new RegExp(q.trim(), 'i'),
      isActive: true,
      _id: { $ne: req.user._id } // Exclude current user
    })
    .select('username firstName lastName profilePicture')
    .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error searching users' });
  }
});

// @route   GET /api/users/:username
// @desc    Get user profile by username
// @access  Private
router.get('/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isActive: true
    }).select('-password -swipeHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
  body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, profilePicture } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      updateData.email = email;
    }
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', [
  auth,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// @route   GET /api/users/:userId/collections
// @desc    Get user's public collections
// @access  Private
router.get('/:userId/collections', auth, async (req, res) => {
  try {
    const Collection = require('../models/Collection');
    
    const collections = await Collection.find({
      createdBy: req.params.userId,
      isActive: true,
      $or: [
        { isPublic: true },
        { 'sharedWith.user': req.user._id }
      ]
    })
    .populate('housingOptions', 'title price images address city state')
    .select('name description createdAt housingCount')
    .sort({ updatedAt: -1 });

    res.json(collections);
  } catch (error) {
    console.error('Get user collections error:', error);
    res.status(500).json({ message: 'Server error fetching user collections' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const Collection = require('../models/Collection');
    
    const [
      totalCollections,
      sharedCollections,
      totalHousingLiked,
      totalReviews
    ] = await Promise.all([
      Collection.countDocuments({ createdBy: req.user._id, isActive: true }),
      Collection.countDocuments({ 'sharedWith.user': req.user._id, isActive: true }),
      User.aggregate([
        { $match: { _id: req.user._id } },
        { $project: { swipeHistoryCount: { $size: '$swipeHistory' } } }
      ]),
      require('../models/HousingOption').countDocuments({
        'tenantReviews.tenantId': req.user._id
      })
    ]);

    res.json({
      totalCollections,
      sharedCollections,
      totalHousingLiked: totalHousingLiked[0]?.swipeHistoryCount || 0,
      totalReviews
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Server error fetching user statistics' });
  }
});

module.exports = router;
