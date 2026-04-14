import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { ServicesPage } from '@/app/pages/ServicesPage';
import { ServiceDetailsPage } from '@/app/pages/ServiceDetailsPage';
import { BookingPage } from '@/pages/BookingPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { SignupPage } from '@/app/pages/SignupPage';
import { GalleryPage } from '@/app/pages/GalleryPage';
import { ContactPage } from '@/app/pages/ContactPage';
import { AboutPage } from '@/app/pages/AboutPage';
import { TermsPage } from '@/app/pages/TermsPage';
import { PrivacyPage } from '@/app/pages/PrivacyPage';
import { ForgotPasswordPage } from '@/app/pages/ForgotPasswordPage';
import { AdminRoute, AnimateurRoute, PrivateRoute } from '@/utils/routes';

// Client Pages
import { MyBookingsPage } from '@/pages/client/MyBookingsPage';
import { BookingDetailPage } from '@/pages/client/BookingDetailPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';

// Admin Pages
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from '@/pages/admin/AdminBookingDetailPage';
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage';
import { AdminOptionsPage } from '@/pages/admin/AdminOptionsPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminAnimateursPage } from '@/pages/admin/AdminAnimateursPage';

// Animateur Pages
import { AnimateurLayout } from '@/pages/animateur/AnimateurLayout';
import { AnimateurDashboardPage } from '@/pages/animateur/AnimateurDashboardPage';
import { MissionsPage } from '@/pages/animateur/MissionsPage';
import { PlanningPage } from '@/pages/animateur/PlanningPage';
import { AvailabilityPage } from '@/pages/animateur/AvailabilityPage';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Client Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Client Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/profile" element={<div className="container mx-auto py-40">Mon Profil (En construction)</div>} />
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
          </Route>

        {/* Animateur Routes */}
        <Route element={<AnimateurRoute />}>
          <Route element={<AnimateurLayout />}>
            <Route path="/animateur" element={<AnimateurDashboardPage />} />
            <Route path="/animateur/missions" element={<MissionsPage />} />
            <Route path="/animateur/planning" element={<PlanningPage />} />
            <Route path="/animateur/disponibilites" element={<AvailabilityPage />} />
          </Route>
        </Route>
        </Route>

        {/* Admin Routes (No Global Header/Footer) */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/bookings/:id" element={<AdminBookingDetailPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/options" element={<AdminOptionsPage />} />
            <Route path="/admin/animateurs" element={<AdminAnimateursPage />} />
            <Route path="/admin/gallery" element={<AdminGalleryPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
