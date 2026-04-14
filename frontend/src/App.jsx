import React from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Header } from '@/app/components/layout/Header';
import { Footer } from '@/app/components/layout/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { ServicesPage } from '@/app/pages/ServicesPage';
import { ServiceDetailsPage } from '@/app/pages/ServiceDetailsPage';
import { GalleryPage } from '@/app/pages/GalleryPage';
import { ContactPage } from '@/app/pages/ContactPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { ForgotPasswordPage } from '@/app/pages/ForgotPasswordPage';
import { BookingPage } from '@/pages/BookingPage';
import { MyBookingsPage } from '@/pages/client/MyBookingsPage';
import { BookingDetailPage } from '@/pages/client/BookingDetailPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminBookingsPage } from '@/pages/admin/AdminBookingsPage';
import { AdminBookingDetailPage } from '@/pages/admin/AdminBookingDetailPage';
import { AdminServicesPage } from '@/pages/admin/AdminServicesPage';
import { AdminOptionsPage } from '@/pages/admin/AdminOptionsPage';
import { AdminGalleryPage } from '@/pages/admin/AdminGalleryPage';
import { AdminAnimateursPage } from '@/pages/admin/AdminAnimateursPage';
import { AnimateurLayout } from '@/pages/animateur/AnimateurLayout';
import { AnimateurDashboardPage } from '@/pages/animateur/AnimateurDashboardPage';
import { PlanningPage } from '@/pages/animateur/PlanningPage';
import { MissionsPage } from '@/pages/animateur/MissionsPage';
import { AvailabilityPage } from '@/pages/animateur/AvailabilityPage';
import { PrivateRoute, AdminRoute, AnimateurRoute } from '@/utils/routes';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { PaymentCancelPage } from '@/pages/PaymentCancelPage';
import { CookieBanner } from '@/components/ui/CookieBanner';

const PublicLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <CookieBanner />
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/termes" element={<TermsPage />} />
          <Route path="/rgpd" element={<PrivacyPage />} />
          <Route path="/a-propos" element={<AboutPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/reservation" element={<BookingPage />} />
            <Route path="/mes-reservations" element={<MyBookingsPage />} />
            <Route path="/reservations/:id" element={<BookingDetailPage />} />
            <Route path="/payment/:bookingId" element={<PaymentPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/reservations" element={<AdminBookingsPage />} />
            <Route path="/admin/reservations/:id" element={<AdminBookingDetailPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/options" element={<AdminOptionsPage />} />
            <Route path="/admin/galerie" element={<AdminGalleryPage />} />
            <Route path="/admin/animateurs" element={<AdminAnimateursPage />} />
          </Route>
        </Route>

        <Route element={<AnimateurRoute />}>
          <Route element={<AnimateurLayout />}>
            <Route path="/animateur" element={<AnimateurDashboardPage />} />
            <Route path="/animateur/planning" element={<PlanningPage />} />
            <Route path="/animateur/missions" element={<MissionsPage />} />
            <Route path="/animateur/disponibilites" element={<AvailabilityPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
