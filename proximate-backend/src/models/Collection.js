const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  housingOptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HousingOption'
  }],
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    sharedAt: {
      type: Date,
      default: Date.now
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
collectionSchema.index({ createdBy: 1 });
collectionSchema.index({ 'sharedWith.user': 1 });
collectionSchema.index({ isPublic: 1 });

// Virtual for housing count
collectionSchema.virtual('housingCount').get(function() {
  return this.housingOptions.length;
});

// Ensure virtual fields are serialized
collectionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Collection', collectionSchema);
