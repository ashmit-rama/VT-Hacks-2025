import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User, HousingOption, Collection, SearchFilters, VoiceInput, SwipeAction } from '../types';

interface ProximateStore extends AppState {
  // Auth actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  
  // Housing actions
  setHousingOptions: (options: HousingOption[]) => void;
  addHousingOption: (option: HousingOption) => void;
  updateHousingOption: (id: string, updates: Partial<HousingOption>) => void;
  
  // Swipe actions
  setCurrentSwipeIndex: (index: number) => void;
  incrementSwipeIndex: () => void;
  addSwipeAction: (action: SwipeAction) => void;
  
  // Collection actions
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  
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
}

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
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
      
      updateCollection: (id, updates) => set((state) => ({
        collections: state.collections.map(collection =>
          collection.id === id ? { ...collection, ...updates } : collection
        )
      })),
      
      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter(collection => collection.id !== id)
      })),
      
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
