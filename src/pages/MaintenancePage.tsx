import { Wrench } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const MaintenancePage = () => {
  const { siteSettings } = useSiteData();

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/logo.png"
            alt={siteSettings.businessName}
            className="w-[280px] md:w-[360px] h-auto mx-auto object-contain mix-blend-lighten"
          />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Wrench className="w-10 h-10 text-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          We'll Be Right Back
        </h1>
        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
          We're currently performing scheduled maintenance to improve your experience.
          Please check back shortly.
        </p>

        {/* Contact Info */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 inline-block">
          <p className="text-sm text-gray-500 mb-3">Need urgent assistance?</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href={`mailto:${siteSettings.email}`}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              {siteSettings.email}
            </a>
            <span className="hidden sm:block text-slate-700">|</span>
            <a
              href={`tel:${siteSettings.phone}`}
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              {siteSettings.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Admin Link (subtle) */}
        <div className="mt-12">
          <a
            href="/admin/login"
            className="text-xs text-slate-700 hover:text-slate-500 transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
