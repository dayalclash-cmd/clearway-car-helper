import { Link } from "react-router-dom";
import { Package, Settings, TrendingUp } from "lucide-react";
import { useSiteData } from "@/context/SiteDataContext";

const AdminDashboard = () => {
  const { packages, siteSettings } = useSiteData();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back. Manage your packages and site settings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Active Packages</span>
          </div>
          <p className="text-3xl font-bold text-white">{packages.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Highlighted</span>
          </div>
          <p className="text-3xl font-bold text-white">
            {packages.filter((p) => p.isHighlighted).length}
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-slate-400">Contact Email</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {siteSettings.email}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/admin/packages"
          className="group bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-slate-900 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <Package className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Manage Packages
              </h3>
              <p className="text-sm text-slate-400">
                Add, edit, or remove service packages
              </p>
            </div>
          </div>
        </Link>
        <Link
          to="/admin/settings"
          className="group bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-slate-900 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Settings className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Site Settings
              </h3>
              <p className="text-sm text-slate-400">
                Update contact info and business details
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
