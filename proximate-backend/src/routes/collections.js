const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const HousingOption = require('../models/HousingOption');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/collections
// @desc    Get user's collections
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id }
      ],
      isActive: true
    })
    .populate('housingOptions', 'title price images address city state')
    .populate('createdBy', 'username firstName lastName')
    .populate('sharedWith.user', 'username firstName lastName')
    .sort({ updatedAt: -1 });

    res.json(collections);
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({ message: 'Server error fetching collections' });
  }
});

// @route   GET /api/collections/:id
// @desc    Get single collection
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id }
      ],
      isActive: true
    })
    .populate('housingOptions')
    .populate('createdBy', 'username firstName lastName')
    .populate('sharedWith.user', 'username firstName lastName');

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({ message: 'Server error fetching collection' });
  }
});

// @route   POST /api/collections
// @desc    Create new collection
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 1 }).withMessage('Collection name is required'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, housingOptions = [] } = req.body;

    const collection = new Collection({
      name,
      description: description || '',
      createdBy: req.user._id,
      housingOptions
    });

    await collection.save();
    await collection.populate('housingOptions', 'title price images address city state');
    await collection.populate('createdBy', 'username firstName lastName');

    res.status(201).json(collection);
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({ message: 'Server error creating collection' });
  }
});

// @route   PUT /api/collections/:id
// @desc    Update collection
// @access  Private
router.put('/:id', [
  auth,
  body('name').optional().trim().isLength({ min: 1 }).withMessage('Collection name cannot be empty'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    const { name, description, housingOptions } = req.body;
    
    if (name) collection.name = name;
    if (description !== undefined) collection.description = description;
    if (housingOptions) collection.housingOptions = housingOptions;

    await collection.save();
    await collection.populate('housingOptions', 'title price images address city state');
    await collection.populate('createdBy', 'username firstName lastName');

    res.json(collection);
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({ message: 'Server error updating collection' });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete collection
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    collection.isActive = false;
    await collection.save();

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({ message: 'Server error deleting collection' });
  }
});

// @route   POST /api/collections/:id/housing/:housingId
// @desc    Add housing option to collection
// @access  Private
router.post('/:id/housing/:housingId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id, 'sharedWith.canEdit': true }
      ],
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    const housingOption = await HousingOption.findById(req.params.housingId);
    if (!housingOption) {
      return res.status(404).json({ message: 'Housing option not found' });
    }

    // Check if housing option is already in collection
    if (collection.housingOptions.includes(housingOption._id)) {
      return res.status(400).json({ message: 'Housing option already in collection' });
    }

    collection.housingOptions.push(housingOption._id);
    await collection.save();

    await collection.populate('housingOptions', 'title price images address city state');

    res.json(collection);
  } catch (error) {
    console.error('Add housing to collection error:', error);
    res.status(500).json({ message: 'Server error adding housing to collection' });
  }
});

// @route   DELETE /api/collections/:id/housing/:housingId
// @desc    Remove housing option from collection
// @access  Private
router.delete('/:id/housing/:housingId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id, 'sharedWith.canEdit': true }
      ],
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    collection.housingOptions = collection.housingOptions.filter(
      id => id.toString() !== req.params.housingId
    );
    
    await collection.save();
    await collection.populate('housingOptions', 'title price images address city state');

    res.json(collection);
  } catch (error) {
    console.error('Remove housing from collection error:', error);
    res.status(500).json({ message: 'Server error removing housing from collection' });
  }
});

// @route   POST /api/collections/:id/share
// @desc    Share collection with user
// @access  Private
router.post('/:id/share', [
  auth,
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('canEdit').optional().isBoolean().withMessage('Can edit must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, canEdit = false } = req.body;

    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    // Find user to share with
    const userToShare = await User.findOne({ username, isActive: true });
    if (!userToShare) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already shared
    const alreadyShared = collection.sharedWith.find(
      share => share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      return res.status(400).json({ message: 'Collection already shared with this user' });
    }

    // Add to shared with
    collection.sharedWith.push({
      user: userToShare._id,
      username: userToShare.username,
      canEdit
    });

    await collection.save();
    await collection.populate('sharedWith.user', 'username firstName lastName');

    res.json({
      message: `Collection shared with ${username} successfully`,
      collection
    });
  } catch (error) {
    console.error('Share collection error:', error);
    res.status(500).json({ message: 'Server error sharing collection' });
  }
});

// @route   DELETE /api/collections/:id/share/:userId
// @desc    Remove user from shared collection
// @access  Private
router.delete('/:id/share/:userId', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      isActive: true
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or access denied' });
    }

    collection.sharedWith = collection.sharedWith.filter(
      share => share.user.toString() !== req.params.userId
    );

    await collection.save();
    await collection.populate('sharedWith.user', 'username firstName lastName');

    res.json({
      message: 'User removed from shared collection',
      collection
    });
  } catch (error) {
    console.error('Remove user from shared collection error:', error);
    res.status(500).json({ message: 'Server error removing user from shared collection' });
  }
});

module.exports = router;
