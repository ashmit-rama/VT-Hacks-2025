const express = require('express');
const { body, validationResult } = require('express-validator');
const HousingOption = require('../models/HousingOption');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/housing
// @desc    Get all housing options with optional filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      amenities,
      maxDistance,
      petFriendly,
      furnished,
      available,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = { isActive: true };

    if (city) filters.city = new RegExp(city, 'i');
    if (state) filters.state = new RegExp(state, 'i');
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }
    if (bedrooms) filters.bedrooms = parseInt(bedrooms);
    if (bathrooms) filters.bathrooms = parseInt(bathrooms);
    if (amenities) {
      const amenityArray = amenities.split(',');
      filters.amenities = { $in: amenityArray };
    }
    if (maxDistance) filters.distanceToCampus = { $lte: parseFloat(maxDistance) };
    if (petFriendly === 'true') filters.amenities = { $in: ['Pet Friendly'] };
    if (furnished === 'true') filters.amenities = { $in: ['Furnished'] };
    if (available !== undefined) filters['availability.available'] = available === 'true';

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const housingOptions = await HousingOption.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('communityTags.createdBy', 'username')
      .populate('tenantReviews.tenantId', 'username');

    const total = await HousingOption.countDocuments(filters);

    res.json({
      housingOptions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        hasNext: skip + housingOptions.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get housing options error:', error);
    res.status(500).json({ message: 'Server error fetching housing options' });
  }
});

// @route   GET /api/housing/:id
// @desc    Get single housing option
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const housingOption = await HousingOption.findById(req.params.id)
      .populate('communityTags.createdBy', 'username')
      .populate('tenantReviews.tenantId', 'username');

    if (!housingOption || !housingOption.isActive) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    // Increment view count
    housingOption.viewCount += 1;
    await housingOption.save();

    res.json(housingOption);
  } catch (error) {
    console.error('Get housing option error:', error);
    res.status(500).json({ message: 'Server error fetching housing option' });
  }
});

// @route   POST /api/housing/:id/like
// @desc    Like a housing option
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const housingOption = await HousingOption.findById(req.params.id);
    
    if (!housingOption) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    // Increment like count
    housingOption.likeCount += 1;
    await housingOption.save();

    // Add to user's swipe history
    req.user.swipeHistory.push({
      housingId: housingOption._id,
      action: 'like',
      timestamp: new Date()
    });
    await req.user.save();

    res.json({ message: 'Housing option liked successfully' });
  } catch (error) {
    console.error('Like housing option error:', error);
    res.status(500).json({ message: 'Server error liking housing option' });
  }
});

// @route   POST /api/housing/:id/dislike
// @desc    Dislike a housing option
// @access  Private
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const housingOption = await HousingOption.findById(req.params.id);
    
    if (!housingOption) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    // Add to user's swipe history
    req.user.swipeHistory.push({
      housingId: housingOption._id,
      action: 'dislike',
      timestamp: new Date()
    });
    await req.user.save();

    res.json({ message: 'Housing option disliked successfully' });
  } catch (error) {
    console.error('Dislike housing option error:', error);
    res.status(500).json({ message: 'Server error disliking housing option' });
  }
});

// @route   POST /api/housing/:id/review
// @desc    Add a review to housing option
// @access  Private
router.post('/:id/review', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10 }).withMessage('Comment must be at least 10 characters'),
  body('wouldRecommend').isBoolean().withMessage('Would recommend must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, pros, cons, wouldRecommend, anonymous } = req.body;

    const housingOption = await HousingOption.findById(req.params.id);
    
    if (!housingOption) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    const review = {
      id: new Date().getTime().toString(),
      housingId: housingOption._id,
      tenantId: req.user._id,
      rating,
      comment,
      pros: pros || [],
      cons: cons || [],
      wouldRecommend,
      anonymous: anonymous || false,
      verified: false
    };

    housingOption.tenantReviews.push(review);
    await housingOption.save();

    res.json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

// @route   POST /api/housing/:id/tag
// @desc    Add a community tag to housing option
// @access  Private
router.post('/:id/tag', [
  auth,
  body('name').trim().isLength({ min: 1 }).withMessage('Tag name is required'),
  body('category').isIn(['amenity', 'lifestyle', 'activity', 'interest']).withMessage('Invalid category'),
  body('description').trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, description, isInclusive } = req.body;

    const housingOption = await HousingOption.findById(req.params.id);
    
    if (!housingOption) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    const tag = {
      id: new Date().getTime().toString(),
      name,
      category,
      description,
      isInclusive: isInclusive || true,
      createdBy: req.user._id
    };

    housingOption.communityTags.push(tag);
    await housingOption.save();

    res.json({ message: 'Community tag added successfully', tag });
  } catch (error) {
    console.error('Add tag error:', error);
    res.status(500).json({ message: 'Server error adding tag' });
  }
});

module.exports = router;
