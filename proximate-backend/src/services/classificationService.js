const natural = require('natural');

class ClassificationService {
  constructor() {
    // Initialize natural language processing tools
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    
    // Define classification patterns
    this.patterns = {
      budget: [
        /\$(\d+)/g,
        /(\d+)\s*dollars?/gi,
        /under\s*\$?(\d+)/gi,
        /less\s*than\s*\$?(\d+)/gi,
        /max\s*\$?(\d+)/gi,
        /budget\s*of\s*\$?(\d+)/gi,
        /affordable/gi,
        /cheap/gi,
        /expensive/gi,
        /luxury/gi
      ],
      bedrooms: [
        /(\d+)\s*bed/gi,
        /(\d+)\s*bedroom/gi,
        /(\d+)\s*bedroom\s*house/gi,
        /(\d+)\s*bedroom\s*apartment/gi,
        /(\d+)\s*bedroom\s*home/gi,
        /(\d+)\s*bedroom\s*place/gi,
        /studio/gi,
        /one\s*bed/gi,
        /two\s*bed/gi,
        /three\s*bed/gi,
        /four\s*bed/gi,
        /single/gi,
        /double/gi,
        /(\d+)\s*br/gi,
        /(\d+)\s*br\s*house/gi,
        /(\d+)\s*br\s*apartment/gi
      ],
      bathrooms: [
        /(\d+)\s*bath/gi,
        /(\d+)\s*bathroom/gi,
        /half\s*bath/gi,
        /full\s*bath/gi,
        /shared\s*bath/gi,
        /private\s*bath/gi
      ],
      amenities: [
        /pet\s*friendly/gi,
        /furnished/gi,
        /unfurnished/gi,
        /parking/gi,
        /garage/gi,
        /laundry/gi,
        /washer/gi,
        /dryer/gi,
        /wifi/gi,
        /internet/gi,
        /air\s*conditioning/gi,
        /ac/gi,
        /heating/gi,
        /dishwasher/gi,
        /pool/gi,
        /gym/gi,
        /fitness/gi,
        /balcony/gi,
        /patio/gi,
        /yard/gi,
        /garden/gi,
        /fireplace/gi,
        /hardwood/gi,
        /carpet/gi,
        /tile/gi
      ],
      location: [
        /near\s*campus/gi,
        /close\s*to\s*campus/gi,
        /walking\s*distance/gi,
        /downtown/gi,
        /city\s*center/gi,
        /suburbs/gi,
        /quiet/gi,
        /busy/gi,
        /safe/gi,
        /unsafe/gi
      ],
      distance: [
        /(\d+)\s*miles?/gi,
        /(\d+)\s*blocks?/gi,
        /(\d+)\s*minutes?\s*walk/gi,
        /(\d+)\s*minutes?\s*drive/gi,
        /walking\s*distance/gi,
        /short\s*walk/gi,
        /long\s*walk/gi
      ],
      lease: [
        /(\d+)\s*month/gi,
        /(\d+)\s*month\s*lease/gi,
        /year\s*lease/gi,
        /short\s*term/gi,
        /long\s*term/gi,
        /flexible/gi,
        /sublet/gi
      ],
      moveIn: [
        /move\s*in/gi,
        /available/gi,
        /immediately/gi,
        /asap/gi,
        /urgent/gi,
        /(\d+)\/(\d+)/g, // Date format
        /january|february|march|april|may|june|july|august|september|october|november|december/gi
      ]
    };

    // Housing type keywords
    this.housingTypes = {
      apartment: ['apartment', 'apt', 'unit', 'flat'],
      house: ['house', 'home', 'residence', 'property'],
      condo: ['condo', 'condominium', 'townhouse'],
      studio: ['studio', 'efficiency'],
      shared: ['shared', 'roommate', 'room', 'sublet']
    };
  }

  /**
   * Classify user input and extract housing preferences
   * @param {string} input - User's voice or text input
   * @returns {Object} Classified preferences
   */
  classifyInput(input) {
    if (!input || typeof input !== 'string') {
      return this.getDefaultPreferences();
    }

    const tokens = this.tokenizer.tokenize(input.toLowerCase());
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    const fullText = input.toLowerCase();

    const classification = {
      originalInput: input,
      confidence: 0,
      preferences: this.getDefaultPreferences(),
      extractedEntities: [],
      housingType: this.classifyHousingType(fullText),
      intent: this.classifyIntent(fullText)
    };

    // Extract budget information
    const budget = this.extractBudget(fullText);
    if (budget) {
      classification.preferences.priceRange.max = budget;
      classification.extractedEntities.push({
        type: 'budget',
        value: budget,
        confidence: 0.9
      });
    }

    // Extract bedroom count
    const bedrooms = this.extractBedrooms(fullText);
    if (bedrooms.length > 0) {
      classification.preferences.bedrooms = bedrooms;
      classification.extractedEntities.push({
        type: 'bedrooms',
        value: bedrooms,
        confidence: 0.9
      });
    }

    // Extract bathroom count
    const bathrooms = this.extractBathrooms(fullText);
    if (bathrooms.length > 0) {
      classification.preferences.bathrooms = bathrooms;
      classification.extractedEntities.push({
        type: 'bathrooms',
        value: bathrooms,
        confidence: 0.9
      });
    }

    // Extract amenities
    const amenities = this.extractAmenities(fullText);
    if (amenities.length > 0) {
      classification.preferences.amenities = amenities;
      classification.extractedEntities.push({
        type: 'amenities',
        value: amenities,
        confidence: 0.8
      });
    }

    // Extract location preferences
    const location = this.extractLocation(fullText);
    if (location) {
      classification.preferences.distanceToCampus = location.distance;
      classification.extractedEntities.push({
        type: 'location',
        value: location,
        confidence: 0.8
      });
    }

    // Extract lease information
    const leaseLength = this.extractLeaseLength(fullText);
    if (leaseLength) {
      classification.preferences.leaseLength = leaseLength;
      classification.extractedEntities.push({
        type: 'lease',
        value: leaseLength,
        confidence: 0.8
      });
    }

    // Calculate overall confidence
    classification.confidence = this.calculateConfidence(classification.extractedEntities);

    return classification;
  }

  /**
   * Extract budget information from input
   */
  extractBudget(text) {
    for (const pattern of this.patterns.budget) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const number = match.match(/\d+/);
          if (number) {
            return parseInt(number[0]);
          }
        }
      }
    }
    return null;
  }

  /**
   * Extract bedroom count from input
   */
  extractBedrooms(text) {
    const bedrooms = [];
    for (const pattern of this.patterns.bedrooms) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (match.includes('studio') || match.includes('single')) {
            bedrooms.push(1);
          } else if (match.includes('two') || match.includes('double')) {
            bedrooms.push(2);
          } else if (match.includes('three')) {
            bedrooms.push(3);
          } else if (match.includes('four')) {
            bedrooms.push(4);
          } else {
            const number = match.match(/\d+/);
            if (number) {
              bedrooms.push(parseInt(number[0]));
            }
          }
        }
      }
    }
    return [...new Set(bedrooms)]; // Remove duplicates
  }

  /**
   * Extract bathroom count from input
   */
  extractBathrooms(text) {
    const bathrooms = [];
    for (const pattern of this.patterns.bathrooms) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (match.includes('half')) {
            bathrooms.push(0.5);
          } else {
            const number = match.match(/\d+/);
            if (number) {
              bathrooms.push(parseInt(number[0]));
            }
          }
        }
      }
    }
    return [...new Set(bathrooms)]; // Remove duplicates
  }

  /**
   * Extract amenities from input
   */
  extractAmenities(text) {
    const amenities = [];
    for (const pattern of this.patterns.amenities) {
      if (pattern.test(text)) {
        const amenity = pattern.source.replace(/[\/\\^$*+?.()|[\]{}]/g, '').replace(/gi$/, '');
        amenities.push(amenity);
      }
    }
    return [...new Set(amenities)]; // Remove duplicates
  }

  /**
   * Extract location preferences from input
   */
  extractLocation(text) {
    let distance = 5; // Default distance
    
    // Check for distance mentions
    for (const pattern of this.patterns.distance) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const number = match.match(/\d+/);
          if (number) {
            distance = parseInt(number[0]);
            break;
          }
        }
      }
    }

    // Check for location keywords
    const isNearCampus = /near\s*campus|close\s*to\s*campus|walking\s*distance|short\s*walk/gi.test(text);
    if (isNearCampus) {
      distance = Math.min(distance, 2);
    }

    return {
      distance,
      isNearCampus,
      keywords: this.extractLocationKeywords(text)
    };
  }

  /**
   * Extract location keywords
   */
  extractLocationKeywords(text) {
    const keywords = [];
    for (const pattern of this.patterns.location) {
      if (pattern.test(text)) {
        keywords.push(pattern.source.replace(/[\/\\^$*+?.()|[\]{}]/g, '').replace(/gi$/, ''));
      }
    }
    return keywords;
  }

  /**
   * Extract lease length from input
   */
  extractLeaseLength(text) {
    for (const pattern of this.patterns.lease) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (match.includes('year')) {
            return 12;
          } else if (match.includes('short')) {
            return 6;
          } else if (match.includes('long')) {
            return 18;
          } else {
            const number = match.match(/\d+/);
            if (number) {
              return parseInt(number[0]);
            }
          }
        }
      }
    }
    return null;
  }

  /**
   * Classify housing type from input
   */
  classifyHousingType(text) {
    for (const [type, keywords] of Object.entries(this.housingTypes)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return type;
        }
      }
    }
    return 'apartment'; // Default
  }

  /**
   * Classify user intent
   */
  classifyIntent(text) {
    if (/find|search|look|need|want|looking for/gi.test(text)) {
      return 'search';
    } else if (/show|display|list/gi.test(text)) {
      return 'display';
    } else if (/recommend|suggest/gi.test(text)) {
      return 'recommendation';
    } else {
      return 'search'; // Default
    }
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(entities) {
    if (entities.length === 0) return 0;
    
    const totalConfidence = entities.reduce((sum, entity) => sum + entity.confidence, 0);
    return Math.min(totalConfidence / entities.length, 1.0);
  }

  /**
   * Get default preferences
   */
  getDefaultPreferences() {
    return {
      campus: 'blacksburg',
      priceRange: { min: 0, max: 2000 },
      bedrooms: [],
      bathrooms: [],
      amenities: [],
      distanceToCampus: 5,
      petFriendly: false,
      furnished: false,
      parking: false,
      laundry: false,
      wifi: false,
      moveInDate: new Date(),
      leaseLength: 12
    };
  }

  /**
   * Generate search filters from classification
   */
  generateSearchFilters(classification) {
    const filters = classification.preferences;
    
    // Apply extracted entities to filters
    classification.extractedEntities.forEach(entity => {
      switch (entity.type) {
        case 'budget':
          filters.priceRange.max = entity.value;
          break;
        case 'bedrooms':
          filters.bedrooms = entity.value;
          break;
        case 'bathrooms':
          filters.bathrooms = entity.value;
          break;
        case 'amenities':
          filters.amenities = entity.value;
          // Set boolean flags for common amenities
          if (entity.value.includes('pet')) filters.petFriendly = true;
          if (entity.value.includes('furnished')) filters.furnished = true;
          if (entity.value.includes('parking')) filters.parking = true;
          if (entity.value.includes('laundry')) filters.laundry = true;
          if (entity.value.includes('wifi')) filters.wifi = true;
          break;
        case 'location':
          filters.distanceToCampus = entity.value.distance;
          break;
        case 'lease':
          filters.leaseLength = entity.value;
          break;
      }
    });

    return filters;
  }
}

module.exports = new ClassificationService();
