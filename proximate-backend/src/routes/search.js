const express = require('express');
const HousingOption = require('../models/HousingOption');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/search/voice
// @desc    Process voice search query
// @access  Public
router.post('/voice', optionalAuth, async (req, res) => {
  try {
    const { transcript, entities } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    // Build search filters based on extracted entities
    const filters = { isActive: true };
    
    if (entities) {
      entities.forEach(entity => {
        switch (entity.type) {
          case 'price':
            if (entity.value) {
              filters.price = { $lte: parseInt(entity.value) };
            }
            break;
          case 'location':
            if (entity.value) {
              filters.$or = [
                { city: new RegExp(entity.value, 'i') },
                { address: new RegExp(entity.value, 'i') }
              ];
            }
            break;
          case 'amenity':
            if (entity.value) {
              filters.amenities = { $in: [entity.value] };
            }
            break;
          case 'bedrooms':
            if (entity.value) {
              filters.bedrooms = parseInt(entity.value);
            }
            break;
          case 'bathrooms':
            if (entity.value) {
              filters.bathrooms = parseInt(entity.value);
            }
            break;
        }
      });
    }

    // Also search in title and description for text matches
    const textSearch = {
      $or: [
        { title: new RegExp(transcript, 'i') },
        { description: new RegExp(transcript, 'i') },
        { amenities: new RegExp(transcript, 'i') }
      ]
    };

    const finalFilters = Object.keys(filters).length > 1 
      ? { $and: [filters, textSearch] }
      : textSearch;

    const housingOptions = await HousingOption.find(finalFilters)
      .limit(20)
      .populate('communityTags.createdBy', 'username')
      .populate('tenantReviews.tenantId', 'username')
      .sort({ createdAt: -1 });

    res.json({
      transcript,
      entities: entities || [],
      results: housingOptions,
      count: housingOptions.length
    });
  } catch (error) {
    console.error('Voice search error:', error);
    res.status(500).json({ message: 'Server error processing voice search' });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    const suggestions = [];

    if (type === 'all' || type === 'locations') {
      // Get location suggestions
      const locations = await HousingOption.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: { city: '$city', state: '$state' } } },
        { $match: { '_id.city': new RegExp(q, 'i') } },
        { $limit: 5 }
      ]);
      
      suggestions.push(...locations.map(loc => ({
        type: 'location',
        value: `${loc._id.city}, ${loc._id.state}`,
        label: `${loc._id.city}, ${loc._id.state}`
      })));
    }

    if (type === 'all' || type === 'amenities') {
      // Get amenity suggestions
      const amenities = await HousingOption.aggregate([
        { $match: { isActive: true } },
        { $unwind: '$amenities' },
        { $group: { _id: '$amenities' } },
        { $match: { '_id': new RegExp(q, 'i') } },
        { $limit: 5 }
      ]);

      suggestions.push(...amenities.map(amenity => ({
        type: 'amenity',
        value: amenity._id,
        label: amenity._id
      })));
    }

    if (type === 'all' || type === 'housing') {
      // Get housing title suggestions
      const housing = await HousingOption.find({
        isActive: true,
        title: new RegExp(q, 'i')
      })
      .select('title')
      .limit(5);

      suggestions.push(...housing.map(h => ({
        type: 'housing',
        value: h.title,
        label: h.title
      })));
    }

    res.json(suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({ message: 'Server error fetching suggestions' });
  }
});

// @route   GET /api/search/nearby
// @desc    Find housing options near a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const housingOptions = await HousingOption.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(maxDistance) * 1000 // Convert km to meters
        }
      }
    })
    .limit(parseInt(limit))
    .populate('communityTags.createdBy', 'username')
    .populate('tenantReviews.tenantId', 'username');

    res.json(housingOptions);
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ message: 'Server error finding nearby housing' });
  }
});

// @route   GET /api/search/recommendations
// @desc    Get personalized housing recommendations
// @access  Private
router.get('/recommendations', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    let filters = { isActive: true };

    // If user is authenticated, use their preferences
    if (req.user) {
      const { preferences, swipeHistory } = req.user;

      // Apply user preferences
      if (preferences.priceRange) {
        filters.price = {
          $gte: preferences.priceRange.min,
          $lte: preferences.priceRange.max
        };
      }

      if (preferences.bedrooms && preferences.bedrooms.length > 0) {
        filters.bedrooms = { $in: preferences.bedrooms };
      }

      if (preferences.bathrooms && preferences.bathrooms.length > 0) {
        filters.bathrooms = { $in: preferences.bathrooms };
      }

      if (preferences.amenities && preferences.amenities.length > 0) {
        filters.amenities = { $in: preferences.amenities };
      }

      if (preferences.distanceToCampus) {
        filters.distanceToCampus = { $lte: preferences.distanceToCampus };
      }

      if (preferences.petFriendly) {
        filters.amenities = { $in: ['Pet Friendly'] };
      }

      if (preferences.furnished) {
        filters.amenities = { $in: ['Furnished'] };
      }

      // Exclude already swiped housing
      if (swipeHistory && swipeHistory.length > 0) {
        const swipedIds = swipeHistory.map(swipe => swipe.housingId);
        filters._id = { $nin: swipedIds };
      }
    }

    const housingOptions = await HousingOption.find(filters)
      .populate('communityTags.createdBy', 'username')
      .populate('tenantReviews.tenantId', 'username')
      .sort({ likeCount: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json(housingOptions);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
});

module.exports = router;
