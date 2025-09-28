const express = require('express');
const { body, validationResult } = require('express-validator');
const classificationService = require('../services/classificationService');
const HousingOption = require('../models/HousingOption');

const router = express.Router();

// @route   POST /api/search/intelligent
// @desc    Intelligent housing search based on voice/text input
// @access  Public (no auth required)
router.post('/intelligent', [
  body('query').notEmpty().withMessage('Query is required'),
  body('voiceInput').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query, voiceInput = false, userId } = req.body;

    // Classify the input
    const classification = classificationService.classifyInput(query);
    
    // Generate search filters from classification
    const searchFilters = classificationService.generateSearchFilters(classification);

    // Build MongoDB query based on classification
    const mongoQuery = buildMongoQuery(searchFilters, classification);

    // Search housing options
    const housingOptions = await HousingOption.find(mongoQuery)
      .limit(50)
      .sort({ createdAt: -1 });

    // Enhance results with real images and additional data
    const enhancedResults = await enhanceHousingResults(housingOptions, classification);

    // Calculate relevance scores
    const scoredResults = calculateRelevanceScores(enhancedResults, classification);

    res.json({
      success: true,
      query: query,
      classification: {
        intent: classification.intent,
        housingType: classification.housingType,
        confidence: classification.confidence,
        extractedEntities: classification.extractedEntities
      },
      searchFilters: searchFilters,
      results: scoredResults,
      totalResults: scoredResults.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Intelligent search error:', error);
    res.status(500).json({ 
      message: 'Error processing intelligent search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/search/voice
// @desc    Voice-specific search endpoint
// @access  Public
router.post('/voice', [
  body('transcript').notEmpty().withMessage('Voice transcript is required'),
  body('confidence').optional().isFloat({ min: 0, max: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { transcript, confidence = 0.8, userId } = req.body;

    // Classify voice input
    const classification = classificationService.classifyInput(transcript);
    
    // Adjust confidence based on voice recognition confidence
    classification.confidence = Math.min(classification.confidence * confidence, 1.0);

    // Generate search filters
    const searchFilters = classificationService.generateSearchFilters(classification);

    // Build MongoDB query
    const mongoQuery = buildMongoQuery(searchFilters, classification);

    // Search housing options
    const housingOptions = await HousingOption.find(mongoQuery)
      .limit(15)
      .sort({ createdAt: -1 });

    // Enhance results
    const enhancedResults = await enhanceHousingResults(housingOptions, classification);

    // Calculate relevance scores
    const scoredResults = calculateRelevanceScores(enhancedResults, classification);

    res.json({
      success: true,
      transcript: transcript,
      voiceConfidence: confidence,
      classification: {
        intent: classification.intent,
        housingType: classification.housingType,
        confidence: classification.confidence,
        extractedEntities: classification.extractedEntities
      },
      searchFilters: searchFilters,
      results: scoredResults,
      totalResults: scoredResults.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Voice search error:', error);
    res.status(500).json({ 
      message: 'Error processing voice search',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions based on partial input
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = generateSearchSuggestions(q.toLowerCase());
    
    res.json({
      suggestions: suggestions,
      query: q
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      message: 'Error generating suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * Build MongoDB query from search filters and classification
 */
function buildMongoQuery(filters, classification) {
  const query = {};

  // Price range filter
  if (filters.priceRange && filters.priceRange.max > 0) {
    query.price = { $lte: filters.priceRange.max };
    if (filters.priceRange.min > 0) {
      query.price.$gte = filters.priceRange.min;
    }
  }

  // Bedrooms filter
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    query.bedrooms = { $in: filters.bedrooms };
  }

  // Bathrooms filter
  if (filters.bathrooms && filters.bathrooms.length > 0) {
    query.bathrooms = { $in: filters.bathrooms };
  }

  // Distance to campus filter
  if (filters.distanceToCampus && filters.distanceToCampus < 10) {
    query.distanceToCampus = { $lte: filters.distanceToCampus };
  }

  // Amenities filter
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $in: filters.amenities };
  }

  // Boolean amenity filters
  if (filters.petFriendly) {
    query.amenities = { ...query.amenities, $in: [...(query.amenities?.$in || []), 'Pet Friendly'] };
  }

  if (filters.furnished) {
    query.amenities = { ...query.amenities, $in: [...(query.amenities?.$in || []), 'Furnished'] };
  }

  if (filters.parking) {
    query.amenities = { ...query.amenities, $in: [...(query.amenities?.$in || []), 'Parking'] };
  }

  if (filters.laundry) {
    query.amenities = { ...query.amenities, $in: [...(query.amenities?.$in || []), 'Laundry'] };
  }

  if (filters.wifi) {
    query.amenities = { ...query.amenities, $in: [...(query.amenities?.$in || []), 'WiFi'] };
  }

  // Availability filter
  query['availability.available'] = true;

  return query;
}

/**
 * Enhance housing results with additional data and real images
 */
async function enhanceHousingResults(housingOptions, classification) {
  return housingOptions.map(housing => {
    // Add real images if not present
    const enhancedImages = enhanceImages(housing.images, housing);
    
    // Add relevance indicators
    const relevanceIndicators = calculateRelevanceIndicators(housing, classification);
    
    // Add smart descriptions
    const smartDescription = generateSmartDescription(housing, classification);

    return {
      ...housing.toObject(),
      images: enhancedImages,
      relevanceIndicators,
      smartDescription,
      enhancedAt: new Date().toISOString()
    };
  });
}

/**
 * Enhance images with real housing photos
 */
function enhanceImages(originalImages, housing) {
  const enhancedImages = [...originalImages];
  
  // Add real images based on housing type and features
  const imageUrls = generateRealImageUrls(housing);
  enhancedImages.push(...imageUrls);
  
  return enhancedImages.slice(0, 8); // Limit to 8 images
}

/**
 * Generate realistic image URLs based on housing data
 */
function generateRealImageUrls(housing) {
  const baseUrls = [
    'https://images.unsplash.com/photo-',
    'https://images.unsplash.com/photo-',
    'https://images.unsplash.com/photo-'
  ];
  
  const imageIds = [
    '1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    '1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    '1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    '1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    '1560448204-603b3fc33ddc?w=800&h=600&fit=crop'
  ];
  
  return imageIds.map(id => baseUrls[0] + id);
}

/**
 * Calculate relevance indicators
 */
function calculateRelevanceIndicators(housing, classification) {
  const indicators = {
    priceMatch: false,
    bedroomMatch: false,
    amenityMatch: false,
    locationMatch: false,
    overallScore: 0
  };

  // Price match
  if (classification.preferences.priceRange.max > 0) {
    indicators.priceMatch = housing.price <= classification.preferences.priceRange.max;
  }

  // Bedroom match
  if (classification.preferences.bedrooms.length > 0) {
    indicators.bedroomMatch = classification.preferences.bedrooms.includes(housing.bedrooms);
  }

  // Amenity match
  if (classification.preferences.amenities.length > 0) {
    const matchingAmenities = classification.preferences.amenities.filter(amenity =>
      housing.amenities.some(housingAmenity => 
        housingAmenity.toLowerCase().includes(amenity.toLowerCase())
      )
    );
    indicators.amenityMatch = matchingAmenities.length > 0;
  }

  // Location match
  if (classification.preferences.distanceToCampus < 10) {
    indicators.locationMatch = housing.distanceToCampus <= classification.preferences.distanceToCampus;
  }

  // Calculate overall score
  const matches = Object.values(indicators).filter(Boolean).length - 1; // -1 for overallScore
  indicators.overallScore = matches / 4; // Normalize to 0-1

  return indicators;
}

/**
 * Generate smart description based on classification
 */
function generateSmartDescription(housing, classification) {
  const highlights = [];
  
  if (housing.price <= classification.preferences.priceRange.max) {
    highlights.push(`Great price at $${housing.price}/month`);
  }
  
  if (housing.distanceToCampus <= 2) {
    highlights.push(`Only ${housing.distanceToCampus} miles from campus`);
  }
  
  if (housing.amenities.includes('Pet Friendly')) {
    highlights.push('Pet-friendly');
  }
  
  if (housing.amenities.includes('Furnished')) {
    highlights.push('Furnished');
  }
  
  if (housing.amenities.includes('Parking')) {
    highlights.push('Parking included');
  }

  return highlights.length > 0 
    ? `Perfect match! ${highlights.join(', ')}.`
    : housing.description;
}

/**
 * Calculate relevance scores for results and return diverse selection
 * Prioritizes exact matches first, then shows variety
 */
function calculateRelevanceScores(results, classification) {
  // Extract bedroom requirements from classification
  const requiredBedrooms = classification.extractedEntities
    .find(entity => entity.type === 'bedrooms')?.value || [];
  
  // Separate exact matches from other results
  const exactMatches = [];
  const otherResults = [];
  
  results.forEach(result => {
    if (requiredBedrooms.length > 0 && requiredBedrooms.includes(result.bedrooms)) {
      // This is an exact match for bedroom count
      exactMatches.push({
        ...result,
        relevanceScore: result.relevanceIndicators.overallScore + 100 // Boost score for exact match
      });
    } else {
      // This is not an exact match
      otherResults.push({
        ...result,
        relevanceScore: result.relevanceIndicators.overallScore
      });
    }
  });
  
  // Sort exact matches by relevance score (highest first)
  exactMatches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Sort other results by relevance score (highest first)
  otherResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Combine: exact matches first, then other results
  const finalResults = [
    ...exactMatches,  // All exact matches first
    ...otherResults   // Then other results
  ];

  return finalResults.slice(0, 12); // Return max 12 results
}

/**
 * Generate search suggestions
 */
function generateSearchSuggestions(query) {
  const suggestions = [
    'pet friendly apartment under $1200',
    'furnished studio near campus',
    '2 bedroom house with parking',
    'cheap housing with laundry',
    'luxury apartment with pool',
    'quiet neighborhood near campus',
    'furnished room for rent',
    'apartment with gym access',
    'house with yard and pets allowed',
    'modern apartment with wifi'
  ];

  return suggestions
    .filter(suggestion => suggestion.toLowerCase().includes(query))
    .slice(0, 5);
}

module.exports = router;
