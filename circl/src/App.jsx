import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@store/authStore';
import useUIStore from '@store/uiStore';

// Layouts
import TopBar from '@components/navigation/TopBar';
import BottomNav from '@components/navigation/BottomNav';
import Sidebar from '@components/navigation/Sidebar';
import RightSidebar from '@components/navigation/RightSidebar';
import { OfflineBanner, Toast } from '@components/common/ErrorBoundary';

// Pages
import SplashScreen from '@pages/auth/SplashScreen';
import LoginPage from '@pages/auth/LoginPage';
import OnboardingFlow from '@pages/auth/OnboardingFlow';
import HomePage from '@pages/feed/HomePage';
import CreatePostPage from '@pages/posts/CreatePostPage';

// Issues
import IssuesBoardPage from '@pages/issues/IssuesBoardPage';
import CreateIssuePage from '@pages/issues/CreateIssuePage';

// Marketplace
import MarketplacePage from '@pages/marketplace/MarketplacePage';
import CreateListingPage from '@pages/marketplace/CreateListingPage';

// Business Directory
import BusinessDirectoryPage from '@pages/business/BusinessDirectoryPage';
import BusinessProfilePage from '@pages/business/BusinessProfilePage';

// Other Modules
import EventsPage from '@pages/events/EventsPage';
import EmergencyAlertPage from '@pages/emergency/EmergencyAlertPage';
import SkillBoardPage from '@pages/skills/SkillBoardPage';
import UserProfilePage from '@pages/profile/UserProfilePage';
import SearchPage from '@pages/search/SearchPage';
import NotificationsPage from '@pages/notifications/NotificationsPage';

// AI & Ads
import ArjunChatPage from '@pages/ai/ArjunChatPage';
import BrandLaunchPage from '@pages/ai/BrandLaunchPage';
import BrandLaunchToolPage from '@pages/ai/BrandLaunchToolPage';
import CreateAdPage from '@pages/ads/CreateAdPage';

// Chat Room
import ChatListPage from '@pages/chat/ChatListPage';
import ChatRoomPage from '@pages/chat/ChatRoomPage';

// Admin
import AdminDashboard from '@pages/admin/AdminDashboard';

// Shell component for authenticated users
const AppShell = ({ children }) => {
  const { isOnline, toast } = useUIStore();
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      {!isOnline && <OfflineBanner />}
      <TopBar />
      
      {/* Responsive Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="hidden md:block md:col-span-1 lg:col-span-3">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="col-span-1 md:col-span-3 lg:col-span-6 bg-card border-x border-outline-variant/10 min-h-screen pb-24 shadow-sm">
          {children}
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

// Route protectors
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isOnboarded, loading } = useAuthStore();
  const location = useLocation();
  const isGuest = sessionStorage.getItem('guest') === 'true';

  if (isGuest) {
    return children;
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const App = () => {
  const { setOnline, darkMode } = useUIStore();

  // Listen to online/offline status
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  return (
    <div className={darkMode ? 'dark bg-inverse-surface' : ''}>
      <Router>
        <Routes>
          {/* Public / Entry routes */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingFlow />
              </ProtectedRoute>
            }
          />

          {/* Protected Main App Shell Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell>
                  <HomePage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Issues */}
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <AppShell>
                  <IssuesBoardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/issues/create"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CreateIssuePage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Create Feed Post */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CreatePostPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Business Directory */}
          <Route
            path="/directory"
            element={
              <ProtectedRoute>
                <AppShell>
                  <BusinessDirectoryPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/directory/:id"
            element={
              <ProtectedRoute>
                <AppShell>
                  <BusinessProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Marketplace */}
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <AppShell>
                  <MarketplacePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/create"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CreateListingPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Profile, Search & Notifications */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell>
                  <UserProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <AppShell>
                  <SearchPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <AppShell>
                  <NotificationsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Additional Modules */}
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <AppShell>
                  <EventsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/emergency"
            element={
              <ProtectedRoute>
                <AppShell>
                  <EmergencyAlertPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <AppShell>
                  <SkillBoardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* AI Features */}
          <Route
            path="/arjun"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ArjunChatPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/brandlaunch"
            element={
              <ProtectedRoute>
                <AppShell>
                  <BrandLaunchPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/brandlaunch/:toolId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <BrandLaunchToolPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Ads & Campaigns */}
          <Route
            path="/ads/create"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CreateAdPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Chat Messenger */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ChatListPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:groupId"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ChatRoomPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Society Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppShell>
                  <AdminDashboard />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Fallback redirects */}
          <Route path="*" element={<Navigate to="/splash" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
