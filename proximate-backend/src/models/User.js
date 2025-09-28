const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  preferences: {
    campus: {
      type: String,
      enum: ['blacksburg', 'arlington', 'roanoke'],
      default: 'blacksburg'
    },
    priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 2000 }
    },
    bedrooms: [Number],
    bathrooms: [Number],
    amenities: [String],
    distanceToCampus: { type: Number, default: 5 },
    petFriendly: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    moveInDate: { type: Date, default: Date.now },
    leaseLength: { type: Number, default: 12 }
  },
  swipeHistory: [{
    housingId: { type: mongoose.Schema.Types.ObjectId, ref: 'HousingOption' },
    action: { type: String, enum: ['like', 'dislike', 'superlike'] },
    timestamp: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
