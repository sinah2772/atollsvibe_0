import { lazy, Suspense } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { startMeasure, endMeasure } from './utils/performance';

// Core layouts
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';

// Eagerly loaded components (critical path)
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import NetworkStatusBanner from './components/ui/NetworkStatusBanner';

// Lazily loaded components (code splitting for better performance)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Articles = lazy(() => import('./pages/Articles'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NewArticle = lazy(() => import('./pages/NewArticle'));
const EditArticle = lazy(() => import('./pages/EditArticle'));
const Comments = lazy(() => import('./pages/Comments'));
const Audience = lazy(() => import('./pages/Audience'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const SignUp = lazy(() => import('./pages/SignUp'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const Article = lazy(() => import('./pages/Article'));
const Category = lazy(() => import('./pages/Category'));
const Subcategory = lazy(() => import('./pages/Subcategory'));
const Search = lazy(() => import('./pages/Search'));
const StorageImages = lazy(() => import('./pages/StorageImages'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const SupabaseDemo = lazy(() => import('./pages/SupabaseDemo'));

// Enhanced article management pages
const AdvancedAnalytics = lazy(() => import('./pages/AdvancedAnalytics'));
const WorkflowPage = lazy(() => import('./pages/WorkflowPage'));
const DataAnalysisPage = lazy(() => import('./pages/DataAnalysisPage'));

// Loading component with reduced motion option
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 rounded-full border-t-transparent"></div>
  </div>
);

function App() {
  // Measure app startup time
  startMeasure('app-render');

  // Log the render time when component mounts
  endMeasure('app-render');

  // Get base path from Vite config
  const basePath = import.meta.env.BASE_URL || '/atollsvibe/';
  
  return (
    <AuthProvider>
      <Router basename={basePath.endsWith('/') ? basePath.slice(0, -1) : basePath}>
        <NetworkStatusBanner />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="article/:id" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Article />
              </Suspense>
            } />
            <Route path="category/:slug" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Category />
              </Suspense>
            } />
            <Route path="category/:categorySlug/:subcategorySlug" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Subcategory />
              </Suspense>
            } />
            <Route path="search" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Search />
              </Suspense>
            } />
          </Route>
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={
            <Suspense fallback={<LoadingSpinner />}>
              <SignUp />
            </Suspense>
          } />
          <Route path="/update-password" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ChangePassword />
            </Suspense>
          } />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <Suspense fallback={<LoadingSpinner />}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="articles" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Articles />
              </Suspense>
            } />
            <Route path="analytics" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Analytics />
              </Suspense>
            } />
            <Route path="new-article" element={
              <Suspense fallback={<LoadingSpinner />}>
                <NewArticle />
              </Suspense>
            } />
            <Route path="edit-article/:id" element={
              <Suspense fallback={<LoadingSpinner />}>
                <EditArticle />
              </Suspense>
            } />
            <Route path="comments" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Comments />
              </Suspense>
            } />
            <Route path="audience" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Audience />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Settings />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Profile />
              </Suspense>
            } />
            <Route path="business" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ProtectedRoute requiredRole="admin">
                  <BusinessDashboard />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="storage-images" element={
              <Suspense fallback={<LoadingSpinner />}>
                <StorageImages />
              </Suspense>
            } />
            <Route path="supabase-demo" element={
              <Suspense fallback={<LoadingSpinner />}>
                <SupabaseDemo />
              </Suspense>
            } />
            <Route path="advanced-analytics" element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdvancedAnalytics />
              </Suspense>
            } />
            <Route path="workflow" element={
              <Suspense fallback={<LoadingSpinner />}>
                <WorkflowPage />
              </Suspense>
            } />
            <Route path="data-analysis" element={
              <Suspense fallback={<LoadingSpinner />}>
                <DataAnalysisPage />
              </Suspense>
            } />
          </Route>
          
          {/* Redirects for handling sub-path issues */}
          <Route path="/dashboard" element={<Navigate to="../dashboard" replace />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } />
          <Route path="/atollsvibe" element={<Navigate to="/" replace />} />
          <Route path="/atollsvibe/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/atollsvibe/dashboard/articles" element={<Navigate to="/dashboard/articles" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;