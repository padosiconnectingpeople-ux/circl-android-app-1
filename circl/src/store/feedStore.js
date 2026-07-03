import { create } from 'zustand';
import {
  collection, query, where, orderBy, limit, startAfter,
  getDocs, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, serverTimestamp, increment, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { db } from '@config/firebase';

const POSTS_PER_PAGE = 10;
const MAX_CACHED_POSTS = 50;

const useFeedStore = create((set, get) => ({
  posts: [],
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,
  lastDoc: null,
  activeFilter: 'society',
  activeCategory: null,
  unsubscribe: null,

  // Set active location filter
  setActiveFilter: (filter) => {
    set({ activeFilter: filter, posts: [], lastDoc: null, hasMore: true });
    get().fetchPosts();
  },

  // Set active category filter
  setActiveCategory: (category) => {
    set({ activeCategory: category, posts: [], lastDoc: null, hasMore: true });
    get().fetchPosts();
  },

  // Subscribe to real-time feed
  subscribeFeed: (locationData) => {
    const { activeFilter } = get();
    const { unsubscribe: prevUnsub } = get();
    if (prevUnsub) prevUnsub();

    set({ loading: true });

    let q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    // Apply location filters
    if (activeFilter !== 'all' && locationData) {
      const locationField = activeFilter === 'society' ? 'society' :
                           activeFilter === 'colony' ? 'colony' :
                           activeFilter === 'area' ? 'area' : 'city';
      if (locationData[locationField]) {
        q = query(
          collection(db, 'posts'),
          where(locationField, '==', locationData[locationField]),
          orderBy('createdAt', 'desc'),
          limit(POSTS_PER_PAGE)
        );
      }
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));

      set({
        posts: posts.slice(0, MAX_CACHED_POSTS),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === POSTS_PER_PAGE,
        loading: false,
      });
    }, (error) => {
      set({ error: error.message, loading: false });
    });

    set({ unsubscribe: unsub });
  },

  // Fetch posts (paginated)
  fetchPosts: async (locationData) => {
    const { lastDoc, activeFilter, activeCategory } = get();
    set({ loading: !lastDoc, loadingMore: !!lastDoc });

    try {
      let constraints = [
        orderBy('createdAt', 'desc'),
        limit(POSTS_PER_PAGE),
      ];

      if (activeFilter !== 'all' && locationData?.[activeFilter]) {
        constraints.unshift(where(activeFilter, '==', locationData[activeFilter]));
      }

      if (activeCategory) {
        constraints.unshift(where('category', '==', activeCategory));
      }

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, 'posts'), ...constraints);
      const snapshot = await getDocs(q);

      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));

      set((state) => ({
        posts: lastDoc
          ? [...state.posts, ...newPosts].slice(0, MAX_CACHED_POSTS)
          : newPosts,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === POSTS_PER_PAGE,
        loading: false,
        loadingMore: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false, loadingMore: false });
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        likes: [],
        saves: [],
        reactions: {},
        shareCount: 0,
        viewCount: 0,
        reportCount: 0,
        reported: false,
        hidden: false,
        createdAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Toggle reaction on a post
  toggleReaction: async (postId, userId, reactionType) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const { posts } = get();
      const post = posts.find(p => p.id === postId);
      const currentReaction = post?.reactions?.[userId];

      if (currentReaction === reactionType) {
        // Remove reaction
        await updateDoc(postRef, {
          [`reactions.${userId}`]: null,
          likes: arrayRemove(userId),
        });
      } else {
        // Add/change reaction
        await updateDoc(postRef, {
          [`reactions.${userId}`]: reactionType,
          likes: arrayUnion(userId),
        });
      }

      // Optimistic update
      set((state) => ({
        posts: state.posts.map(p => {
          if (p.id !== postId) return p;
          const newReactions = { ...p.reactions };
          if (currentReaction === reactionType) {
            delete newReactions[userId];
          } else {
            newReactions[userId] = reactionType;
          }
          return { ...p, reactions: newReactions };
        }),
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Toggle save
  toggleSave: async (postId, userId) => {
    try {
      const postRef = doc(db, 'posts', postId);
      const { posts } = get();
      const post = posts.find(p => p.id === postId);
      const isSaved = post?.saves?.includes(userId);

      await updateDoc(postRef, {
        saves: isSaved ? arrayRemove(userId) : arrayUnion(userId),
      });

      set((state) => ({
        posts: state.posts.map(p => {
          if (p.id !== postId) return p;
          return {
            ...p,
            saves: isSaved
              ? p.saves.filter(id => id !== userId)
              : [...(p.saves || []), userId],
          };
        }),
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Cleanup
  cleanup: () => {
    const { unsubscribe } = get();
    if (unsubscribe) unsubscribe();
    set({ posts: [], lastDoc: null, hasMore: true, unsubscribe: null });
  },
}));

export default useFeedStore;
