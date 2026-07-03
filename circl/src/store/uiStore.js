import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LANGUAGES } from '@config/constants';

const useUIStore = create(
  persist(
    (set, get) => ({
      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Theme
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Loading states
      globalLoading: false,
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      // Online status
      isOnline: navigator.onLine,
      setOnline: (online) => set({ isOnline: online }),

      // Toast notifications
      toast: null,
      showToast: (message, type = 'info', duration = 3000) => {
        set({ toast: { message, type, id: Date.now() } });
        setTimeout(() => set({ toast: null }), duration);
      },

      // Modal
      activeModal: null,
      modalData: null,
      openModal: (modalId, data = null) => set({ activeModal: modalId, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),

      // Bottom sheet
      bottomSheet: null,
      openBottomSheet: (content) => set({ bottomSheet: content }),
      closeBottomSheet: () => set({ bottomSheet: null }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: [],
      addRecentSearch: (query) => {
        set((state) => ({
          recentSearches: [query, ...state.recentSearches.filter(s => s !== query)].slice(0, 10),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'circl-ui',
      partialize: (state) => ({
        language: state.language,
        darkMode: state.darkMode,
        recentSearches: state.recentSearches,
      }),
    }
  )
);

export default useUIStore;
