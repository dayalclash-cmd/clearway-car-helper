import { useState } from "react";
import { useSiteData } from "@/context/SiteDataContext";
import type { Package } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Star,
  GripVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ─────────────── Empty package template ─────────────── */
const emptyPackage = (): Package => ({
  id: crypto.randomUUID(),
  name: "",
  price: "",
  perBooking: "per booking",
  badge: "",
  isHighlighted: false,
  description: "",
  details: "",
  includes: [],
  includesLabel: "",
  supportItems: [],
  supportLabel: "",
  valueAdd: "",
  disclaimer: "",
});

/* ─────────────── Dynamic list editor ─────────────── */
const ListEditor = ({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
    <button
      type="button"
      onClick={() => onChange([...items, ""])}
      className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
    >
      + Add item
    </button>
  </div>
);

/* ═══════════════════════ Main Component ═══════════════════════ */
const AdminPackages = () => {
  const { packages, addPackage, updatePackage, deletePackage } = useSiteData();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Package | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  /* ── open editor ── */
  const handleAdd = () => {
    setEditing(emptyPackage());
    setIsNew(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditing({ ...pkg });
    setIsNew(false);
  };

  const handleClose = () => {
    setEditing(null);
    setIsNew(false);
  };

  /* ── save ── */
  const handleSave = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price.trim()) {
      toast({
        title: "Missing required fields",
        description: "Package name and price are required.",
        variant: "destructive",
      });
      return;
    }

    // Clean up empty strings from lists
    const cleaned: Package = {
      ...editing,
      includes: editing.includes?.filter((s) => s.trim()) || [],
      supportItems: editing.supportItems?.filter((s) => s.trim()) || [],
    };

    if (isNew) {
      addPackage(cleaned);
      toast({ title: "Package added", description: `"${cleaned.name}" has been created.` });
    } else {
      updatePackage(cleaned);
      toast({ title: "Package updated", description: `"${cleaned.name}" has been saved.` });
    }
    handleClose();
  };

  /* ── delete ── */
  const handleDelete = (id: string) => {
    const pkg = packages.find((p) => p.id === id);
    deletePackage(id);
    setDeleteConfirm(null);
    toast({ title: "Package deleted", description: `"${pkg?.name}" has been removed.` });
  };

  const update = <K extends keyof Package>(key: K, value: Package[K]) => {
    if (!editing) return;
    setEditing({ ...editing, [key]: value });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Packages
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your service packages shown on the website.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {/* Package Cards */}
      <div className="space-y-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-slate-700 transition-colors"
          >
            <GripVertical className="w-5 h-5 text-slate-600 shrink-0 hidden sm:block" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white truncate">
                  {pkg.name}
                </h3>
                {pkg.isHighlighted && (
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                )}
                {pkg.badge && (
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 truncate">
                {pkg.price} {pkg.perBooking || "per booking"} — {pkg.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(pkg)}
                className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(pkg.id)}
                className="inline-flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg mb-2">No packages yet</p>
            <p className="text-sm">Click "Add Package" to create your first one.</p>
          </div>
        )}
      </div>

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Package
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete "
              {packages.find((p) => p.id === deleteConfirm)?.name}"? This cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit / Add Modal ─── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                {isNew ? "Add New Package" : `Edit "${editing.name}"`}
              </h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Row: Name + Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. The Atlantic"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Price *
                  </label>
                  <input
                    type="text"
                    value={editing.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="e.g. €14.99"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Row: Per Booking + Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Price Suffix
                  </label>
                  <input
                    type="text"
                    value={editing.perBooking || ""}
                    onChange={(e) => update("perBooking", e.target.value)}
                    placeholder="per booking"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    value={editing.badge || ""}
                    onChange={(e) => update("badge", e.target.value)}
                    placeholder="e.g. Recommended"
                    className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Highlighted toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update("isHighlighted", !editing.isHighlighted)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    editing.isHighlighted ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                      editing.isHighlighted ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-300">
                  Highlight this package (featured)
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              {/* Details */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Details
                </label>
                <textarea
                  value={editing.details || ""}
                  onChange={(e) => update("details", e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              {/* Includes */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Includes Label
                </label>
                <input
                  type="text"
                  value={editing.includesLabel || ""}
                  onChange={(e) => update("includesLabel", e.target.value)}
                  placeholder="e.g. Includes:"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <ListEditor
                label="Includes Items"
                items={editing.includes || []}
                onChange={(items) => update("includes", items)}
              />

              {/* Support */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Support Label
                </label>
                <input
                  type="text"
                  value={editing.supportLabel || ""}
                  onChange={(e) => update("supportLabel", e.target.value)}
                  placeholder="e.g. Support during your rental:"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <ListEditor
                label="Support Items"
                items={editing.supportItems || []}
                onChange={(items) => update("supportItems", items)}
              />

              {/* Value Add */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Value Add Text
                </label>
                <textarea
                  value={editing.valueAdd || ""}
                  onChange={(e) => update("valueAdd", e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              {/* Disclaimer */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Disclaimer *
                </label>
                <input
                  type="text"
                  value={editing.disclaimer}
                  onChange={(e) => update("disclaimer", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-slate-800">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                {isNew ? "Add Package" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
