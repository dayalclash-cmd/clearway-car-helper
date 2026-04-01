import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SiteDataProvider, useSiteData } from "@/context/SiteDataContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";
import MaintenancePage from "@/pages/MaintenancePage";

// Admin
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminSiteSettings from "@/pages/admin/AdminSiteSettings";

const queryClient = new QueryClient();

/* Inner component that can access SiteDataContext */
const AppRoutes = () => {
  const { siteSettings, isLoading } = useSiteData();
  const isMaintenanceMode = siteSettings.maintenanceMode === true;

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ─── Admin Routes (always accessible) ─── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="settings" element={<AdminSiteSettings />} />
        </Route>

        {/* ─── Public Routes (gated by maintenance mode) ─── */}
        <Route
          path="/*"
          element={
            isMaintenanceMode && !isLoading ? (
              <MaintenancePage />
            ) : (
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SiteDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </SiteDataProvider>
  </QueryClientProvider>
);

export default App;
