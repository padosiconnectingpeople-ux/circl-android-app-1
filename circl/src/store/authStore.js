import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithPopup,
  signInWithPhoneNumber,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@config/firebase';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      isOnboarded: false,

      // Initialize auth listener
      initAuth: () => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const profile = await get().fetchProfile(user.uid);
            set({
              user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
              },
              profile,
              isAuthenticated: true,
              isOnboarded: !!profile?.city,
              loading: false,
            });
          } else {
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isOnboarded: false,
              loading: false,
            });
          }
        });
      },

      // Google Sign In
      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null });
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;

          // Check if profile exists
          const profileRef = doc(db, 'users', user.uid);
          const profileSnap = await getDoc(profileRef);

          if (!profileSnap.exists()) {
            // Create initial profile
            await setDoc(profileRef, {
              name: user.displayName || '',
              email: user.email || '',
              photoURL: user.photoURL || '',
              phone: user.phoneNumber || '',
              role: 'user',
              verified: false,
              banned: false,
              warningCount: 0,
              reputation: 0,
              interests: [],
              language: 'en',
              memberSince: serverTimestamp(),
              createdAt: serverTimestamp(),
            });
          }

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Phone OTP Sign In
      signInWithPhone: async (phoneNumber, recaptchaVerifier) => {
        try {
          set({ loading: true, error: null });
          const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
          return { success: true, confirmationResult };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Verify OTP
      verifyOTP: async (confirmationResult, code) => {
        try {
          set({ loading: true, error: null });
          const result = await confirmationResult.confirm(code);
          const user = result.user;

          // Check if profile exists
          const profileRef = doc(db, 'users', user.uid);
          const profileSnap = await getDoc(profileRef);

          if (!profileSnap.exists()) {
            await setDoc(profileRef, {
              name: '',
              email: '',
              phone: user.phoneNumber || '',
              photoURL: '',
              role: 'user',
              verified: false,
              banned: false,
              warningCount: 0,
              reputation: 0,
              interests: [],
              language: 'en',
              memberSince: serverTimestamp(),
              createdAt: serverTimestamp(),
            });
          }

          return { success: true };
        } catch (error) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Fetch user profile
      fetchProfile: async (uid) => {
        try {
          const profileRef = doc(db, 'users', uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profile = { id: profileSnap.id, ...profileSnap.data() };
            set({ profile });
            return profile;
          }
          return null;
        } catch (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
      },

      // Update profile
      updateProfile: async (data) => {
        try {
          const { user } = get();
          if (!user) return { success: false };

          const profileRef = doc(db, 'users', user.uid);
          await updateDoc(profileRef, {
            ...data,
            updatedAt: serverTimestamp(),
          });

          set((state) => ({
            profile: { ...state.profile, ...data },
            isOnboarded: !!data.city || state.isOnboarded,
          }));

          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      // Complete onboarding
      completeOnboarding: async (onboardingData) => {
        try {
          const { user } = get();
          if (!user) return { success: false };

          const profileRef = doc(db, 'users', user.uid);
          await updateDoc(profileRef, {
            ...onboardingData,
            onboardedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });

          set((state) => ({
            profile: { ...state.profile, ...onboardingData },
            isOnboarded: true,
          }));

          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },

      // Sign out
      signOut: async () => {
        try {
          await firebaseSignOut(auth);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isOnboarded: false,
          });
        } catch (error) {
          console.error('Sign out error:', error);
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'circl-auth',
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
      }),
    }
  )
);

export default useAuthStore;
