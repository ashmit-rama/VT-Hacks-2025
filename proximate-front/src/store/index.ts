import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, HousingOption, Collection, SearchFilters, VoiceInput, SwipeAction } from '../types';
import apiService from '../services/api';

interface ProximateStore extends AppState {
  // Auth actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  
  // Housing actions
  setHousingOptions: (options: HousingOption[]) => void;
  addHousingOption: (option: HousingOption) => void;
  updateHousingOption: (id: string, updates: Partial<HousingOption>) => void;
  loadHousingOptions: (filters?: any) => Promise<void>;
  likeHousing: (id: string) => Promise<void>;
  dislikeHousing: (id: string) => Promise<void>;
  
  // Swipe actions
  setCurrentSwipeIndex: (index: number) => void;
  incrementSwipeIndex: () => void;
  addSwipeAction: (action: SwipeAction) => void;
  
  // Collection actions
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  createCollection: (name: string) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addToSavedCollection: (housing: HousingOption) => void;
  addToMyFavorites: (housing: HousingOption) => void;
  loadCollections: () => Promise<void>;
  shareCollection: (collectionId: string, username: string, canEdit?: boolean) => Promise<void>;
  intelligentSearch: (query: string, voiceInput?: boolean) => Promise<any>;
  voiceSearch: (transcript: string, confidence?: number) => Promise<any>;
  
  // Search actions
  setSearchFilters: (filters: SearchFilters) => void;
  updateSearchFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  
  // Voice input actions
  addVoiceInput: (input: VoiceInput) => void;
  setVoiceInputs: (inputs: VoiceInput[]) => void;
  
  // General actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  clearCollections: () => void;
}

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
  },
  housingOptions: [],
  currentSwipeIndex: 0,
  collections: [],
  searchFilters: {
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
    leaseLength: 12,
  },
  voiceInputs: [],
  isLoading: false,
  error: null,
};

export const useProximateStore = create<ProximateStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Auth actions
      setUser: (user) => set((state) => ({
        auth: { ...state.auth, user, isAuthenticated: !!user }
      })),
      
      setAuthLoading: (isLoading) => set((state) => ({
        auth: { ...state.auth, isLoading }
      })),
      
      setAuthError: (error) => set((state) => ({
        auth: { ...state.auth, error }
      })),

      login: async (credentials) => {
        set((state) => ({ auth: { ...state.auth, isLoading: true, error: null } }));
        try {
          const data = await apiService.login(credentials);
          set((state) => ({
            auth: { 
              ...state.auth, 
              user: data.user, 
              isAuthenticated: true, 
              isLoading: false, 
              error: null 
            }
          }));
        } catch (error) {
          set((state) => ({
            auth: { ...state.auth, isLoading: false, error: error instanceof Error ? error.message : 'Login failed' }
          }));
          throw error;
        }
      },

      register: async (userData) => {
        set((state) => ({ auth: { ...state.auth, isLoading: true, error: null } }));
        try {
          const data = await apiService.register(userData);
          set((state) => ({
            auth: { 
              ...state.auth, 
              user: data.user, 
              isAuthenticated: true, 
              isLoading: false, 
              error: null 
            }
          }));
        } catch (error) {
          set((state) => ({
            auth: { ...state.auth, isLoading: false, error: error instanceof Error ? error.message : 'Login failed' }
          }));
          throw error;
        }
      },

      logout: () => {
        apiService.logout();
        set((state) => ({
          auth: { ...state.auth, user: null, isAuthenticated: false, error: null }
        }));
      },

      loadUser: async () => {
        set((state) => ({ auth: { ...state.auth, isLoading: true } }));
        try {
          const data = await apiService.getCurrentUser();
          set((state) => ({
            auth: { 
              ...state.auth, 
              user: data.user, 
              isAuthenticated: true, 
              isLoading: false 
            }
          }));
        } catch (error) {
          set((state) => ({
            auth: { ...state.auth, isLoading: false, error: null }
          }));
        }
      },
      
      // Housing actions
      setHousingOptions: (housingOptions) => set({ housingOptions }),
      
      addHousingOption: (option) => set((state) => ({
        housingOptions: [...state.housingOptions, option]
      })),
      
      updateHousingOption: (id, updates) => set((state) => ({
        housingOptions: state.housingOptions.map(option =>
          option.id === id ? { ...option, ...updates } : option
        )
      })),

      loadHousingOptions: async (filters) => {
        try {
          const data = await apiService.getHousingOptions(filters);
          set({ housingOptions: data.housingOptions });
        } catch (error) {
          console.error('Error loading housing options:', error);
        }
      },

      likeHousing: async (id) => {
        try {
          await apiService.likeHousingOption(id);
        } catch (error) {
          console.error('Error liking housing:', error);
        }
      },

      dislikeHousing: async (id) => {
        try {
          await apiService.dislikeHousingOption(id);
        } catch (error) {
          console.error('Error disliking housing:', error);
        }
      },
      
      // Swipe actions
      setCurrentSwipeIndex: (currentSwipeIndex) => set({ currentSwipeIndex }),
      
      incrementSwipeIndex: () => set((state) => ({
        currentSwipeIndex: state.currentSwipeIndex + 1
      })),
      
      addSwipeAction: (action) => {
        // In a real app, this would be sent to the backend
        console.log('Swipe action:', action);
      },
      
      // Collection actions
      setCollections: (collections) => set({ collections }),
      
      addCollection: (collection) => set((state) => ({
        collections: [...state.collections, collection]
      })),
      
      createCollection: async (name) => {
        try {
          const data = await apiService.createCollection({ name });
          set((state) => ({
            collections: [...state.collections, data]
          }));
        } catch (error) {
          console.error('Error creating collection:', error);
          throw error;
        }
      },
      
      updateCollection: (id, updates) => set((state) => ({
        collections: state.collections.map(collection =>
          collection.id === id ? { ...collection, ...updates } : collection
        )
      })),
      
      deleteCollection: async (id) => {
        try {
          await apiService.deleteCollection(id);
          set((state) => ({
            collections: state.collections.filter(collection => collection.id !== id)
          }));
        } catch (error) {
          console.error('Error deleting collection:', error);
          throw error;
        }
      },
      
      addToSavedCollection: async (housing) => {
        try {
          console.log('💾 Adding to shared collection:', housing.title);
          console.log('🔐 User authenticated:', !!get().auth.user);
          console.log('🔐 Auth state:', get().auth.isAuthenticated);
          
          // Always ensure we have a valid token
          let token = localStorage.getItem('token');
          if (!token || !get().auth.user) {
            console.log('🔐 No valid token/user, logging in with test user...');
            try {
              const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: 'test@example.com',
                  password: 'password123'
                })
              });
              
              if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login successful:', loginData.user.username);
                token = loginData.token;
                localStorage.setItem('token', token || '');
                set((state) => ({
                  auth: {
                    ...state.auth,
                    user: loginData.user,
                    isAuthenticated: true,
                    token: token
                  }
                }));
                console.log('🔑 Token stored:', !!token);
              } else {
                console.error('❌ Login failed');
                return;
              }
            } catch (loginError) {
              console.error('❌ Login error:', loginError);
              return;
            }
          }
          
          // Find or create "Saved Collection" (shared with roommates)
          let savedCollection = get().collections.find(col => col.name === "Saved Collection");
          console.log('📁 Found collection:', savedCollection?.name || 'None found');
          
          if (!savedCollection) {
            console.log('🆕 Creating new "Saved Collection"');
            const data = await apiService.createCollection({ 
              name: 'Saved Collection',
              description: 'Shared housing options for roommates'
            });
            savedCollection = data;
            set((state) => ({
              collections: [...state.collections, data]
            }));
            console.log('✅ Created collection:', data.name);
          }
          
          if (savedCollection) {
            console.log('🔄 Adding housing to collection:', savedCollection.id);
            console.log('🏠 Housing object:', housing);
            console.log('🏠 Housing ID:', housing.id);
            console.log('🏠 Housing _id:', (housing as any)._id);
            
            // Use _id if id is not available
            const housingId = housing.id || (housing as any)._id;
            if (!housingId) {
              console.error('❌ No valid housing ID found');
              return;
            }
            
            await apiService.addHousingToCollection(savedCollection.id, housingId);
            
            const updatedCollection = {
              ...savedCollection,
              housingOptions: [...savedCollection.housingOptions, housing],
              updatedAt: new Date()
            };
            set((state) => ({
              collections: state.collections.map(collection =>
                collection.id === savedCollection!.id ? updatedCollection : collection
              )
            }));
            console.log('✅ Successfully added to shared collection!');
          }
        } catch (error) {
          console.error('❌ Error adding to saved collection:', error);
          console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
        }
      },

      addToMyFavorites: async (housing) => {
        try {
          console.log('⭐ Adding to my favorites:', housing.title);
          console.log('🔐 User authenticated:', !!get().auth.user);
          console.log('🔐 Auth state:', get().auth.isAuthenticated);
          
          // Always ensure we have a valid token
          let token = localStorage.getItem('token');
          if (!token || !get().auth.user) {
            console.log('🔐 No valid token/user, logging in with test user...');
            try {
              const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: 'test@example.com',
                  password: 'password123'
                })
              });
              
              if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login successful:', loginData.user.username);
                token = loginData.token;
                localStorage.setItem('token', token || '');
                set((state) => ({
                  auth: {
                    ...state.auth,
                    user: loginData.user,
                    isAuthenticated: true,
                    token: token
                  }
                }));
                console.log('🔑 Token stored:', !!token);
              } else {
                console.error('❌ Login failed');
                return;
              }
            } catch (loginError) {
              console.error('❌ Login error:', loginError);
              return;
            }
          }
          
          // Find or create "My Favorites" collection (private)
          let favoritesCollection = get().collections.find(col => col.name === "My Favorites");
          console.log('📁 Found favorites collection:', favoritesCollection?.name || 'None found');
          
          if (!favoritesCollection) {
            console.log('🆕 Creating new "My Favorites" collection');
            const data = await apiService.createCollection({ 
              name: 'My Favorites',
              description: 'My private favorite housing options'
            });
            favoritesCollection = data;
            set((state) => ({
              collections: [...state.collections, data]
            }));
            console.log('✅ Created favorites collection:', data.name);
          }
          
          if (favoritesCollection) {
            console.log('🔄 Adding housing to favorites:', favoritesCollection.id);
            console.log('🏠 Housing object:', housing);
            console.log('🏠 Housing ID:', housing.id);
            console.log('🏠 Housing _id:', (housing as any)._id);
            
            // Use _id if id is not available
            const housingId = housing.id || (housing as any)._id;
            if (!housingId) {
              console.error('❌ No valid housing ID found');
              return;
            }
            
            await apiService.addHousingToCollection(favoritesCollection.id, housingId);
            
            const updatedCollection = {
              ...favoritesCollection,
              housingOptions: [...favoritesCollection.housingOptions, housing],
              updatedAt: new Date()
            };
            set((state) => ({
              collections: state.collections.map(collection =>
                collection.id === favoritesCollection!.id ? updatedCollection : collection
              )
            }));
            console.log('✅ Successfully added to favorites!');
          }
        } catch (error) {
          console.error('❌ Error adding to favorites:', error);
          console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
        }
      },

      loadCollections: async () => {
        try {
          const collections = await apiService.getCollections();
          set({ collections });
        } catch (error) {
          console.error('Error loading collections:', error);
        }
      },

      shareCollection: async (collectionId, username, canEdit = false) => {
        try {
          await apiService.shareCollection(collectionId, username, canEdit);
          // Reload collections to get updated data
          await get().loadCollections();
        } catch (error) {
          console.error('Error sharing collection:', error);
          throw error;
        }
      },

      intelligentSearch: async (query, voiceInput = false) => {
        try {
          const result = await apiService.intelligentSearch(query, voiceInput);
          return result;
        } catch (error) {
          console.error('Error in intelligent search:', error);
          throw error;
        }
      },

      voiceSearch: async (transcript, confidence = 0.8) => {
        try {
          const result = await apiService.voiceSearch(transcript, confidence);
          return result;
        } catch (error) {
          console.error('Error in voice search:', error);
          throw error;
        }
      },
      
      // Search actions
      setSearchFilters: (searchFilters) => set({ searchFilters }),
      
      updateSearchFilter: (key, value) => set((state) => ({
        searchFilters: { ...state.searchFilters, [key]: value }
      })),
      
      // Voice input actions
      addVoiceInput: (input) => set((state) => ({
        voiceInputs: [...state.voiceInputs, input]
      })),
      
      setVoiceInputs: (voiceInputs) => set({ voiceInputs }),
      
      // General actions
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
      
      clearCollections: () => set({ collections: [] }),
    }),
    {
      name: 'proximate-store',
      partialize: (state) => ({
        auth: state.auth,
        collections: state.collections,
        searchFilters: state.searchFilters,
        voiceInputs: state.voiceInputs,
      }),
    }
  )
);
