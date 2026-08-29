import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import MovieDetails from '../pages/MovieDetails';
import SeatSelection from '../pages/SeatSelection';
import MyBookings from '../pages/MyBookings';
import Profile from '../pages/Profile';
import Watchlist from '../pages/Watchlist';
import AdminDashboard from '../pages/AdminDashboard';
import Navbar from '../components/Navbar';
import BookingSuccess from '../pages/BookingSuccess';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center text-sm text-white/60">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />
      <div className="pt-2">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Login /></div>} />
          <Route path="/signup" element={<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Signup /></div>} />
          <Route path="/movies/:id" element={<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><MovieDetails /></div>} />

          <Route path="/booking/:showId" element={
            <ProtectedRoute>
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><SeatSelection /></div>
            </ProtectedRoute>
          } />

          <Route path="/success/:bookingId" element={
            <ProtectedRoute>
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><BookingSuccess /></div>
            </ProtectedRoute>
          } />

          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><MyBookings /></div>
            </ProtectedRoute>
          } />

          <Route path="/watchlist" element={
            <ProtectedRoute>
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Watchlist /></div>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"><Profile /></div>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/movies" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/theatres" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/shows" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/locations" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/screens" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/audit" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AppRoutes;
