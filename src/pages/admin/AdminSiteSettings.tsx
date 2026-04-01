import { useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import type { SiteSettings } from "@/types";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminSiteSettings = () => {
  const { siteSettings, updateSiteSettings } = useSiteData();
  const { toast } = useToast();
  const [form, setForm] = useState<SiteSettings>({ ...siteSettings });
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!form.email.trim() || !form.phone.trim()) {
      toast({
        title: "Missing required fields",
        description: "Email and phone are required.",
        variant: "destructive",
      });
      return;
    }
    updateSiteSettings(form);
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Your site settings have been updated.",
    });
  };

  const handleReset = () => {
    setForm({ ...siteSettings });
    setHasChanges(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Site Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Update the contact information shown across the website.
          </p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2.5 rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 ${
              hasChanges
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl space-y-6">
        {/* Maintenance Mode */}
        <div className={`border rounded-xl p-6 transition-colors ${form.maintenanceMode ? 'bg-amber-950/30 border-amber-600/50' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                🔧 Maintenance Mode
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                When enabled, all visitors will see a "We'll Be Right Back" page. Admin panel remains accessible.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                update("maintenanceMode", !form.maintenanceMode);
              }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${form.maintenanceMode ? 'bg-amber-500 focus:ring-amber-500' : 'bg-slate-700 focus:ring-slate-500'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${form.maintenanceMode ? 'translate-x-8' : 'translate-x-1'}`}
              />
            </button>
          </div>
          {form.maintenanceMode && (
            <div className="mt-3 flex items-center gap-2 text-amber-400 text-sm font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Website is currently in maintenance mode
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="alan@clearwaycarhire.ie"
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used in Header, Footer, CTAs, and Contact page
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Phone Number (tel: format) *
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+353892559729"
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Used for the clickable phone link (tel: protocol)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Phone Display Text
              </label>
              <input
                type="text"
                value={form.phoneDisplay}
                onChange={(e) => update("phoneDisplay", e.target.value)}
                placeholder="00353 89 2559729"
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-xs text-slate-500 mt-1">
                How the phone number appears visually on the site
              </p>
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Business Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => update("businessName", e.target.value)}
                placeholder="Clearway Car Hire"
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tagline
              </label>
              <textarea
                value={form.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                rows={2}
                className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Shown below the logo in the footer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
