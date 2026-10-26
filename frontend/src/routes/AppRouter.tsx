import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import PageLoader from '../components/ui/PageLoader';
import AppLayout from '../layouts/AppLayout';
import PublicLayout from '../layouts/PublicLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../features/auth/LoginPage';
import PublicOnlyRoute from './PublicOnlyRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const RegisterPage = lazy(() => import('../features/auth/RegisterPage'));
const EventsPage = lazy(() => import('../features/events/EventsPage'));
const EventDetailsPage = lazy(() => import('../features/events/EventDetailsPage'));
const VerifyEmailPage = lazy(() => import('../features/auth/VerifyEmailPage'));
const ProfilePage = lazy(() => import('../features/auth/ProfilePage'));
const OrganizerEventsPage = lazy(() => import('../features/events/OrganizerEventsPage'));

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<RoleProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
              <Route path="/organizer/events" element={<OrganizerEventsPage />} />
            </Route>
            {/*
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            */}
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
