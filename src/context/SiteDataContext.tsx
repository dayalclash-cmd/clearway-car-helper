import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Package, SiteSettings } from "@/types";

/* ──────────────────────────── defaults ──────────────────────────── */

const DEFAULT_PACKAGES: Package[] = [
  {
    id: "atlantic",
    name: "The Atlantic",
    price: "€14.99",
    description:
      "Our entry-level service helps you find the best car hire options in Ireland quickly and without the hassle of searching multiple websites.",
    details:
      "Simply tell us your travel dates and pickup location, and we will search trusted Irish rental providers to find suitable options for your trip. We'll send you a shortlist of reliable rental choices, helping you avoid hidden fees and poor-quality providers.",
    disclaimer: "You complete the booking directly with the rental provider.",
  },
  {
    id: "celtic",
    name: "The Celtic",
    price: "€24.99",
    includes: [
      "Everything in The Atlantic",
      "Comparison of multiple trusted rental providers",
      "Expert advice on vehicle type, insurance options, and rental conditions",
      "Help choosing the best value option for your trip",
    ],
    description:
      "Avoid costly mistakes and hidden charges with guidance from someone who understands the Irish car hire market.",
    disclaimer: "You complete the booking directly with the rental provider.",
  },
  {
    id: "emerald",
    name: "The Emerald",
    price: "€49",
    badge: "Recommended",
    isHighlighted: true,
    description:
      "A personalised service for customers who want expert assistance before and during their car hire in Ireland.",
    includesLabel: "Includes:",
    includes: [
      "Everything in The Celtic package",
      "We arrange your car hire booking for you",
      "Priority assistance when organising your rental",
      "Help sourcing premium or specialist vehicles",
    ],
    supportLabel: "Support during your rental:",
    supportItems: [
      "Assistance with vehicle questions",
      "Help if any issues arise with your rental",
      "Support contacting the rental provider",
      "General guidance during your hire period",
    ],
    valueAdd:
      "Enjoy peace of mind knowing you have independent support throughout your rental in Ireland.",
    disclaimer:
      "Bookings are completed directly with the selected rental provider.",
  },
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "alan@clearwaycarhire.ie",
  phone: "+353892559729",
  phoneDisplay: "00353 89 2559729",
  businessName: "Clearway Car Hire",
  tagline:
    "Independent car hire consultancy in Ireland. Honest advice, clear pricing, personal service.",
};

/* ──────────────────────────── context ───────────────────────────── */

interface SiteDataContextValue {
  packages: Package[];
  siteSettings: SiteSettings;
  updatePackage: (pkg: Package) => void;
  addPackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  reorderPackages: (packages: Package[]) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(
  undefined
);

const STORAGE_KEY_PACKAGES = "clearway_packages";
const STORAGE_KEY_SETTINGS = "clearway_site_settings";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* corrupted data — use defaults */
  }
  return fallback;
}

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [packages, setPackages] = useState<Package[]>(() =>
    loadFromStorage(STORAGE_KEY_PACKAGES, DEFAULT_PACKAGES)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage(STORAGE_KEY_SETTINGS, DEFAULT_SITE_SETTINGS)
  );

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  const updatePackage = useCallback((pkg: Package) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
  }, []);

  const addPackage = useCallback((pkg: Package) => {
    setPackages((prev) => [...prev, pkg]);
  }, []);

  const deletePackage = useCallback((id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reorderPackages = useCallback((newOrder: Package[]) => {
    setPackages(newOrder);
  }, []);

  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
  }, []);

  return (
    <SiteDataContext.Provider
      value={{
        packages,
        siteSettings,
        updatePackage,
        addPackage,
        deletePackage,
        reorderPackages,
        updateSiteSettings,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx)
    throw new Error("useSiteData must be used within a SiteDataProvider");
  return ctx;
}
