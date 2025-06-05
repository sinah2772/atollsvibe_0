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

const ChangePassword = lazy(() => import('./pages/ChangePassword'));

// Enhanced article management pages
const AdvancedAnalytics = lazy(() => import('./pages/AdvancedAnalytics'));
const WorkflowPage = lazy(() => import('./pages/WorkflowPage'));
const DataAnalysisPage = lazy(() => import('./pages/DataAnalysisPage'));

// Loading component removed - no longer showing loaders

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
              <Suspense fallback={<div></div>}>
                <Article />
              </Suspense>
            } />
            <Route path="category/:slug" element={
              <Suspense fallback={<div></div>}>
                <Category />
              </Suspense>
            } />
            <Route path="category/:categorySlug/:subcategorySlug" element={
              <Suspense fallback={<div></div>}>
                <Subcategory />
              </Suspense>
            } />
            <Route path="search" element={
              <Suspense fallback={<div></div>}>
                <Search />
              </Suspense>
            } />
          </Route>
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={
            <Suspense fallback={<div></div>}>
              <SignUp />
            </Suspense>
          } />
          <Route path="/update-password" element={
            <Suspense fallback={<div></div>}>
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
              <Suspense fallback={<div></div>}>
                <Dashboard />
              </Suspense>
            } />
            <Route path="articles" element={
              <Suspense fallback={<div></div>}>
                <Articles />
              </Suspense>
            } />
            <Route path="analytics" element={
              <Suspense fallback={<div></div>}>
                <Analytics />
              </Suspense>
            } />
            <Route path="new-article" element={
              <Suspense fallback={<div></div>}>
                <NewArticle />
              </Suspense>
            } />
            <Route path="edit-article/:id" element={
              <Suspense fallback={<div></div>}>
                <EditArticle />
              </Suspense>
            } />
            <Route path="comments" element={
              <Suspense fallback={<div></div>}>
                <Comments />
              </Suspense>
            } />
            <Route path="audience" element={
              <Suspense fallback={<div></div>}>
                <Audience />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<div></div>}>
                <Settings />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<div></div>}>
                <Profile />
              </Suspense>
            } />
            <Route path="business" element={
              <Suspense fallback={<div></div>}>
                <ProtectedRoute requiredRole="admin">
                  <BusinessDashboard />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="advanced-analytics" element={
              <Suspense fallback={<div></div>}>
                <AdvancedAnalytics />
              </Suspense>
            } />
            <Route path="workflow" element={
              <Suspense fallback={<div></div>}>
                <WorkflowPage />
              </Suspense>
            } />
            <Route path="data-analysis" element={
              <Suspense fallback={<div></div>}>
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