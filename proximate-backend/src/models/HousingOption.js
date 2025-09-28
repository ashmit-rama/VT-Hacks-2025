const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const landlordSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  responseTime: { type: String, default: '24 hours' }
});

const availabilitySchema = new mongoose.Schema({
  moveInDate: { type: Date, required: true },
  leaseLength: { type: Number, required: true }, // in months
  available: { type: Boolean, default: true }
});

const communityTagSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['amenity', 'lifestyle', 'activity', 'interest'],
    required: true 
  },
  description: { type: String, required: true },
  isInclusive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const tenantReviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  housingId: { type: mongoose.Schema.Types.ObjectId, ref: 'HousingOption' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  pros: [String],
  cons: [String],
  wouldRecommend: { type: Boolean, required: true },
  anonymous: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const housingOptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  squareFeet: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  amenities: [String],
  coordinates: {
    type: coordinatesSchema,
    required: true
  },
  distanceToCampus: {
    type: Number,
    required: true,
    min: 0
  },
  distanceToGym: {
    type: Number,
    required: true,
    min: 0
  },
  commuteTime: {
    type: Number,
    required: true,
    min: 0
  },
  landlord: {
    type: landlordSchema,
    required: true
  },
  availability: {
    type: availabilitySchema,
    required: true
  },
  communityTags: [communityTagSchema],
  tenantReviews: [tenantReviewSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
housingOptionSchema.index({ coordinates: '2dsphere' });
housingOptionSchema.index({ city: 1, state: 1 });
housingOptionSchema.index({ price: 1 });
housingOptionSchema.index({ bedrooms: 1, bathrooms: 1 });
housingOptionSchema.index({ 'availability.available': 1 });

module.exports = mongoose.model('HousingOption', housingOptionSchema);
