const mongoose = require('mongoose');
const User = require('../models/User');
const HousingOption = require('../models/HousingOption');
const Collection = require('../models/Collection');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proximate');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await HousingOption.deleteMany({});
    await Collection.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        preferences: {
          campus: 'blacksburg',
          priceRange: { min: 800, max: 1500 },
          bedrooms: [1, 2],
          bathrooms: [1, 2],
          amenities: ['WiFi', 'Parking'],
          distanceToCampus: 3,
          petFriendly: true,
          furnished: false,
          parking: true,
          laundry: true,
          wifi: true
        }
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        preferences: {
          campus: 'blacksburg',
          priceRange: { min: 1000, max: 2000 },
          bedrooms: [2, 3],
          bathrooms: [2],
          amenities: ['WiFi', 'Laundry', 'Furnished'],
          distanceToCampus: 2,
          petFriendly: false,
          furnished: true,
          parking: false,
          laundry: true,
          wifi: true
        }
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Wilson',
        preferences: {
          campus: 'blacksburg',
          priceRange: { min: 600, max: 1200 },
          bedrooms: [1],
          bathrooms: [1],
          amenities: ['WiFi'],
          distanceToCampus: 5,
          petFriendly: false,
          furnished: false,
          parking: false,
          laundry: false,
          wifi: true
        }
      }
    ]);
    console.log('Created sample users');

    // Create sample housing options
    const housingOptions = await HousingOption.create([
      {
        title: 'Modern Apartment Near Campus',
        description: 'Beautiful 2-bedroom apartment with modern amenities, perfect for students. Located just 0.8 miles from Virginia Tech campus.',
        address: '123 Main St',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1200,
        bedrooms: 2,
        bathrooms: 1.5,
        squareFeet: 950,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Furnished'],
        coordinates: { lat: 37.2296, lng: -80.4139 },
        distanceToCampus: 0.8,
        distanceToGym: 1.2,
        commuteTime: 12,
        landlord: {
          id: 'landlord1',
          name: 'VT Properties',
          rating: 4.5,
          responseTime: '2 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag1',
            name: 'Pet Friendly',
            category: 'amenity',
            description: 'This building welcomes pets',
            isInclusive: true,
            createdBy: users[0]._id
          }
        ],
        tenantReviews: [
          {
            id: 'review1',
            housingId: null, // Will be set after creation
            tenantId: users[1]._id,
            rating: 4,
            comment: 'Great location and responsive landlord. The apartment is well-maintained and the neighbors are quiet.',
            pros: ['Great location', 'Responsive landlord', 'Quiet neighbors'],
            cons: ['Limited parking'],
            wouldRecommend: true,
            anonymous: false,
            verified: true
          }
        ],
        likeCount: 15,
        viewCount: 45
      },
      {
        title: 'Cozy House with Yard',
        description: 'Charming 3-bedroom house with a private yard, ideal for students who want more space.',
        address: '456 Oak Ave',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1800,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1400,
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Yard', 'Dishwasher'],
        coordinates: { lat: 37.2356, lng: -80.4089 },
        distanceToCampus: 1.5,
        distanceToGym: 2.0,
        commuteTime: 18,
        landlord: {
          id: 'landlord2',
          name: 'Hometown Rentals',
          rating: 4.2,
          responseTime: '4 hours'
        },
        availability: {
          moveInDate: new Date('2024-07-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag2',
            name: 'Quiet Neighborhood',
            category: 'lifestyle',
            description: 'Peaceful residential area',
            isInclusive: true,
            createdBy: users[1]._id
          }
        ],
        tenantReviews: [],
        likeCount: 8,
        viewCount: 23
      },
      {
        title: 'Studio Apartment Downtown',
        description: 'Compact studio apartment in the heart of downtown Blacksburg. Perfect for single students.',
        address: '789 College Ave',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 800,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 450,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Furnished'],
        coordinates: { lat: 37.2316, lng: -80.4109 },
        distanceToCampus: 0.5,
        distanceToGym: 0.8,
        commuteTime: 8,
        landlord: {
          id: 'landlord3',
          name: 'Downtown Properties',
          rating: 4.0,
          responseTime: '6 hours'
        },
        availability: {
          moveInDate: new Date('2024-09-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [],
        tenantReviews: [
          {
            id: 'review2',
            housingId: null,
            tenantId: users[2]._id,
            rating: 3,
            comment: 'Small but functional. Great location for campus access.',
            pros: ['Great location', 'Affordable'],
            cons: ['Very small', 'No parking'],
            wouldRecommend: true,
            anonymous: false,
            verified: true
          }
        ],
        likeCount: 12,
        viewCount: 38
      },
      {
        title: 'Luxury Condo Complex',
        description: 'High-end 2-bedroom condo with premium amenities including gym and pool.',
        address: '321 University Blvd',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 2200,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Furnished', 'Gym', 'Pool'],
        coordinates: { lat: 37.2286, lng: -80.4159 },
        distanceToCampus: 1.2,
        distanceToGym: 0.3,
        commuteTime: 15,
        landlord: {
          id: 'landlord4',
          name: 'Luxury Living',
          rating: 4.8,
          responseTime: '1 hour'
        },
        availability: {
          moveInDate: new Date('2024-08-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag3',
            name: 'Luxury Living',
            category: 'lifestyle',
            description: 'High-end amenities and modern design',
            isInclusive: true,
            createdBy: users[0]._id
          }
        ],
        tenantReviews: [],
        likeCount: 25,
        viewCount: 67
      },
      {
        title: 'Shared House - Room Available',
        description: 'Private room in a 4-bedroom shared house. Common areas include living room, kitchen, and backyard.',
        address: '555 Campus Dr',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 650,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 200,
        images: [
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Laundry', 'Shared Kitchen', 'Backyard'],
        coordinates: { lat: 37.2346, lng: -80.4129 },
        distanceToCampus: 1.8,
        distanceToGym: 2.2,
        commuteTime: 20,
        landlord: {
          id: 'landlord5',
          name: 'Student Housing Co',
          rating: 4.1,
          responseTime: '3 hours'
        },
        availability: {
          moveInDate: new Date('2024-07-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag4',
            name: 'Social Environment',
            category: 'lifestyle',
            description: 'Great for meeting other students',
            isInclusive: true,
            createdBy: users[1]._id
          }
        ],
        tenantReviews: [
          {
            id: 'review3',
            housingId: null,
            tenantId: users[0]._id,
            rating: 4,
            comment: 'Great place to meet people. Roommates are friendly and respectful.',
            pros: ['Social environment', 'Affordable', 'Good location'],
            cons: ['Shared spaces', 'Limited privacy'],
            wouldRecommend: true,
            anonymous: false,
            verified: true
          }
        ],
        likeCount: 18,
        viewCount: 52
      },
      {
        title: 'Pet-Friendly Apartment Complex',
        description: 'Spacious 1-bedroom apartment perfect for pet owners. Features include pet washing station and dog park.',
        address: '789 Pet Lane',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1100,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 750,
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600566753086-5f71c2202b2f?w=800&h=600&fit=crop'
        ],
        amenities: ['Pet Friendly', 'Parking', 'Laundry', 'WiFi', 'Dog Park'],
        coordinates: { lat: 37.2400, lng: -80.4000 },
        distanceToCampus: 2.1,
        distanceToGym: 2.5,
        commuteTime: 22,
        landlord: {
          id: 'landlord6',
          name: 'Pet Paradise Properties',
          rating: 4.3,
          responseTime: '2 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag5',
            name: 'Pet Community',
            category: 'lifestyle',
            description: 'Perfect for pet owners',
            isInclusive: true,
            createdBy: users[2]._id
          }
        ],
        tenantReviews: [],
        likeCount: 22,
        viewCount: 58
      },
      {
        title: 'Budget-Friendly Studio',
        description: 'Affordable studio apartment for budget-conscious students. Basic amenities included.',
        address: '456 Budget St',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 600,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 350,
        images: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Basic Furnished'],
        coordinates: { lat: 37.2450, lng: -80.3950 },
        distanceToCampus: 2.8,
        distanceToGym: 3.2,
        commuteTime: 28,
        landlord: {
          id: 'landlord7',
          name: 'Budget Housing Inc',
          rating: 3.8,
          responseTime: '8 hours'
        },
        availability: {
          moveInDate: new Date('2024-07-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [],
        tenantReviews: [],
        likeCount: 8,
        viewCount: 35
      },
      {
        title: 'Furnished 2BR Apartment',
        description: 'Fully furnished 2-bedroom apartment with modern appliances and stylish decor.',
        address: '321 Furnished Ave',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1400,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1000,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
        ],
        amenities: ['Furnished', 'Parking', 'Laundry', 'WiFi', 'Dishwasher'],
        coordinates: { lat: 37.2300, lng: -80.4100 },
        distanceToCampus: 1.0,
        distanceToGym: 1.5,
        commuteTime: 12,
        landlord: {
          id: 'landlord8',
          name: 'Furnished Living',
          rating: 4.4,
          responseTime: '3 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [],
        tenantReviews: [],
        likeCount: 19,
        viewCount: 42
      },
      {
        title: 'Quiet Suburban House',
        description: 'Peaceful 3-bedroom house in quiet neighborhood, perfect for graduate students.',
        address: '789 Quiet Rd',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1600,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1300,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Yard', 'Garage'],
        coordinates: { lat: 37.2500, lng: -80.3800 },
        distanceToCampus: 3.5,
        distanceToGym: 4.0,
        commuteTime: 35,
        landlord: {
          id: 'landlord9',
          name: 'Quiet Living Properties',
          rating: 4.6,
          responseTime: '4 hours'
        },
        availability: {
          moveInDate: new Date('2024-09-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag6',
            name: 'Graduate Student Friendly',
            category: 'lifestyle',
            description: 'Perfect for quiet study environment',
            isInclusive: true,
            createdBy: users[0]._id
          }
        ],
        tenantReviews: [],
        likeCount: 14,
        viewCount: 28
      },
      {
        title: 'Modern Loft Downtown',
        description: 'Stylish loft apartment with exposed brick and high ceilings in downtown Blacksburg.',
        address: '555 Loft St',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1300,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 800,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Furnished', 'Exposed Brick', 'High Ceilings'],
        coordinates: { lat: 37.2320, lng: -80.4080 },
        distanceToCampus: 0.7,
        distanceToGym: 1.0,
        commuteTime: 10,
        landlord: {
          id: 'landlord10',
          name: 'Urban Living Co',
          rating: 4.2,
          responseTime: '5 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag7',
            name: 'Urban Lifestyle',
            category: 'lifestyle',
            description: 'Perfect for city living enthusiasts',
            isInclusive: true,
            createdBy: users[1]._id
          }
        ],
        tenantReviews: [],
        likeCount: 16,
        viewCount: 39
      },
      {
        title: 'Family-Style House',
        description: 'Large 4-bedroom house perfect for sharing with roommates. Spacious common areas.',
        address: '888 Family Way',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 2000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 1800,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Yard', 'Multiple Bathrooms'],
        coordinates: { lat: 37.2380, lng: -80.4020 },
        distanceToCampus: 2.2,
        distanceToGym: 2.8,
        commuteTime: 25,
        landlord: {
          id: 'landlord11',
          name: 'Family Housing Solutions',
          rating: 4.0,
          responseTime: '6 hours'
        },
        availability: {
          moveInDate: new Date('2024-07-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag8',
            name: 'Roommate Friendly',
            category: 'lifestyle',
            description: 'Great for sharing with friends',
            isInclusive: true,
            createdBy: users[2]._id
          }
        ],
        tenantReviews: [],
        likeCount: 11,
        viewCount: 33
      },
      {
        title: 'Eco-Friendly Apartment',
        description: 'Environmentally conscious 1-bedroom apartment with solar panels and energy-efficient appliances.',
        address: '777 Green St',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 950,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 600,
        images: [
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
        ],
        amenities: ['WiFi', 'Solar Panels', 'Energy Efficient', 'Recycling'],
        coordinates: { lat: 37.2420, lng: -80.3980 },
        distanceToCampus: 2.5,
        distanceToGym: 3.0,
        commuteTime: 30,
        landlord: {
          id: 'landlord12',
          name: 'Green Living Properties',
          rating: 4.7,
          responseTime: '2 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag9',
            name: 'Eco-Friendly',
            category: 'lifestyle',
            description: 'Environmentally conscious living',
            isInclusive: true,
            createdBy: users[0]._id
          }
        ],
        tenantReviews: [],
        likeCount: 27,
        viewCount: 61
      },
      {
        title: 'Spacious 3BR Family Home',
        description: 'Large 3-bedroom family home with modern kitchen, living room, and private backyard. Perfect for families or roommates.',
        address: '999 Family Lane',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1700,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1500,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Yard', 'Modern Kitchen'],
        coordinates: { lat: 37.2450, lng: -80.3900 },
        distanceToCampus: 2.8,
        distanceToGym: 3.2,
        commuteTime: 28,
        landlord: {
          id: 'landlord13',
          name: 'Family First Properties',
          rating: 4.4,
          responseTime: '3 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag10',
            name: 'Family Friendly',
            category: 'lifestyle',
            description: 'Perfect for families with children',
            isInclusive: true,
            createdBy: users[1]._id
          }
        ],
        tenantReviews: [],
        likeCount: 13,
        viewCount: 31
      },
      {
        title: 'Modern 2BR Apartment Complex',
        description: 'Contemporary 2-bedroom apartment in a modern complex with fitness center and community amenities.',
        address: '444 Modern Way',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1350,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1100,
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Furnished', 'Fitness Center'],
        coordinates: { lat: 37.2350, lng: -80.4050 },
        distanceToCampus: 1.3,
        distanceToGym: 1.8,
        commuteTime: 16,
        landlord: {
          id: 'landlord14',
          name: 'Modern Living Complex',
          rating: 4.3,
          responseTime: '4 hours'
        },
        availability: {
          moveInDate: new Date('2024-08-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag11',
            name: 'Modern Living',
            category: 'lifestyle',
            description: 'Contemporary amenities and design',
            isInclusive: true,
            createdBy: users[2]._id
          }
        ],
        tenantReviews: [],
        likeCount: 21,
        viewCount: 47
      },
      {
        title: 'Historic 3BR Victorian House',
        description: 'Charming Victorian-style house with original character, hardwood floors, and vintage charm. 3 bedrooms with period details.',
        address: '222 Historic Ave',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1650,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1450,
        images: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Hardwood Floors', 'Historic Character'],
        coordinates: { lat: 37.2400, lng: -80.3950 },
        distanceToCampus: 2.2,
        distanceToGym: 2.7,
        commuteTime: 24,
        landlord: {
          id: 'landlord15',
          name: 'Historic Properties LLC',
          rating: 4.5,
          responseTime: '5 hours'
        },
        availability: {
          moveInDate: new Date('2024-09-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag12',
            name: 'Historic Charm',
            category: 'lifestyle',
            description: 'Beautiful historic character and details',
            isInclusive: true,
            createdBy: users[0]._id
          }
        ],
        tenantReviews: [],
        likeCount: 18,
        viewCount: 39
      },
      {
        title: 'Luxury 2BR Penthouse',
        description: 'High-end 2-bedroom penthouse with panoramic views, premium finishes, and concierge service.',
        address: '111 Skyline Dr',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1300,
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Furnished', 'Concierge', 'Panoramic Views'],
        coordinates: { lat: 37.2250, lng: -80.4200 },
        distanceToCampus: 1.5,
        distanceToGym: 2.0,
        commuteTime: 18,
        landlord: {
          id: 'landlord16',
          name: 'Skyline Luxury Living',
          rating: 4.9,
          responseTime: '1 hour'
        },
        availability: {
          moveInDate: new Date('2024-08-01'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag13',
            name: 'Luxury Living',
            category: 'lifestyle',
            description: 'Premium amenities and services',
            isInclusive: true,
            createdBy: users[1]._id
          }
        ],
        tenantReviews: [],
        likeCount: 35,
        viewCount: 78
      },
      {
        title: 'Cozy 3BR Cottage',
        description: 'Adorable 3-bedroom cottage with a front porch, garden space, and rustic charm. Perfect for students who want character.',
        address: '333 Cottage Lane',
        city: 'Blacksburg',
        state: 'VA',
        zipCode: '24060',
        price: 1550,
        bedrooms: 3,
        bathrooms: 1,
        squareFeet: 1200,
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c69b6c8?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop'
        ],
        amenities: ['Parking', 'Laundry', 'WiFi', 'Front Porch', 'Garden Space'],
        coordinates: { lat: 37.2480, lng: -80.3850 },
        distanceToCampus: 3.2,
        distanceToGym: 3.8,
        commuteTime: 32,
        landlord: {
          id: 'landlord17',
          name: 'Cottage Rentals',
          rating: 4.2,
          responseTime: '6 hours'
        },
        availability: {
          moveInDate: new Date('2024-07-15'),
          leaseLength: 12,
          available: true
        },
        communityTags: [
          {
            id: 'tag14',
            name: 'Rustic Charm',
            category: 'lifestyle',
            description: 'Cozy cottage living with character',
            isInclusive: true,
            createdBy: users[2]._id
          }
        ],
        tenantReviews: [],
        likeCount: 16,
        viewCount: 34
      }
    ]);

    // Update housing IDs in reviews
    for (let i = 0; i < housingOptions.length; i++) {
      const housing = housingOptions[i];
      for (let j = 0; j < housing.tenantReviews.length; j++) {
        housing.tenantReviews[j].housingId = housing._id;
      }
      await housing.save();
    }
    console.log('Created sample housing options');

    // Create sample collections
    const collections = await Collection.create([
      {
        name: 'My Favorites',
        description: 'Housing options I really like',
        createdBy: users[0]._id,
        housingOptions: [housingOptions[0]._id, housingOptions[3]._id],
        sharedWith: [
          {
            user: users[1]._id,
            username: users[1].username,
            canEdit: true
          }
        ],
        isPublic: false
      },
      {
        name: 'Budget Options',
        description: 'Affordable housing under $1000',
        createdBy: users[1]._id,
        housingOptions: [housingOptions[2]._id, housingOptions[4]._id],
        sharedWith: [],
        isPublic: true
      },
      {
        name: 'Luxury Living',
        description: 'High-end housing with premium amenities',
        createdBy: users[0]._id,
        housingOptions: [housingOptions[3]._id],
        sharedWith: [
          {
            user: users[2]._id,
            username: users[2].username,
            canEdit: false
          }
        ],
        isPublic: false
      }
    ]);
    console.log('Created sample collections');

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${housingOptions.length} housing options`);
    console.log(`Created ${collections.length} collections`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedData();
