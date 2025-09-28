export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  preferences: UserPreferences;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  campus: 'blacksburg' | 'arlington' | 'roanoke';
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number[];
  bathrooms: number[];
  amenities: string[];
  distanceToCampus: number;
  petFriendly: boolean;
  furnished: boolean;
  parking: boolean;
  laundry: boolean;
  wifi: boolean;
  moveInDate: Date;
  leaseLength: number;
}

export interface HousingOption {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  images: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  distanceToCampus: number;
  distanceToGym: number;
  commuteTime: number;
  landlord: {
    id: string;
    name: string;
    rating: number;
    responseTime: string;
  };
  availability: {
    moveInDate: Date;
    leaseLength: number; // in months
    available: boolean;
  };
  communityTags: CommunityTag[];
  tenantReviews: TenantReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityTag {
  id: string;
  name: string;
  category: 'interest' | 'activity' | 'lifestyle' | 'amenity';
  description: string;
  isInclusive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface TenantReview {
  id: string;
  housingId: string;
  tenantId: string;
  rating: number;
  comment: string;
  pros: string[];
  cons: string[];
  wouldRecommend: boolean;
  anonymous: boolean;
  createdAt: Date;
  verified: boolean;
}

export interface VoiceInput {
  id: string;
  userId: string;
  audioBlob: Blob;
  transcript: string;
  language: string;
  confidence: number;
  extractedEntities: ExtractedEntity[];
  createdAt: Date;
}

export interface ExtractedEntity {
  type: 'commute_mode' | 'commute_time' | 'budget' | 'quiet_hours' | 'interest' | 'accessibility' | 'amenity';
  value: string | number;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

export interface SwipeAction {
  housingId: string;
  action: 'like' | 'dislike';
  timestamp: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  housingOptions: HousingOption[];
  sharedWith: Array<{
    user: string;
    username: string;
    sharedAt: Date;
    canEdit: boolean;
  }>;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Campus {
  id: string;
  name: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  radius: number; // search radius in miles
}

export interface SearchFilters {
  campus: string;
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number[];
  bathrooms: number[];
  amenities: string[];
  distanceToCampus: number;
  petFriendly: boolean;
  furnished: boolean;
  parking: boolean;
  laundry: boolean;
  wifi: boolean;
  moveInDate: Date;
  leaseLength: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface AppState {
  auth: AuthState;
  housingOptions: HousingOption[];
  currentSwipeIndex: number;
  collections: Collection[];
  searchFilters: SearchFilters;
  voiceInputs: VoiceInput[];
  isLoading: boolean;
  error: string | null;
}
