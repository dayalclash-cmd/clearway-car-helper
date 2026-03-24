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

/* ──────────────────────── API helpers ────────────────────────────── */

const API_URL = "/api/site-data";

async function fetchSiteData(): Promise<{
  packages: Package[] | null;
  siteSettings: SiteSettings | null;
}> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API error");
    return await res.json();
  } catch {
    return { packages: null, siteSettings: null };
  }
}

async function saveSiteData(data: {
  packages?: Package[];
  siteSettings?: SiteSettings;
}): Promise<boolean> {
  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer Tellico78*`,
      },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ──────────────────────────── context ───────────────────────────── */

interface SiteDataContextValue {
  packages: Package[];
  siteSettings: SiteSettings;
  updatePackage: (pkg: Package) => void;
  addPackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  reorderPackages: (packages: Package[]) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  isLoading: boolean;
}

const SiteDataContext = createContext<SiteDataContextValue | undefined>(
  undefined
);

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);
  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: fetch latest data from KV via API
  useEffect(() => {
    fetchSiteData().then((data) => {
      if (data.packages) setPackages(data.packages);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      setIsLoading(false);
    });
  }, []);

  // Helper: persist packages to KV
  const persistPackages = useCallback((newPackages: Package[]) => {
    setPackages(newPackages);
    saveSiteData({ packages: newPackages });
  }, []);

  const updatePackage = useCallback(
    (pkg: Package) => {
      const updated = packages.map((p) => (p.id === pkg.id ? pkg : p));
      persistPackages(updated);
    },
    [packages, persistPackages]
  );

  const addPackage = useCallback(
    (pkg: Package) => {
      const updated = [...packages, pkg];
      persistPackages(updated);
    },
    [packages, persistPackages]
  );

  const deletePackage = useCallback(
    (id: string) => {
      const updated = packages.filter((p) => p.id !== id);
      persistPackages(updated);
    },
    [packages, persistPackages]
  );

  const reorderPackages = useCallback(
    (newOrder: Package[]) => {
      persistPackages(newOrder);
    },
    [persistPackages]
  );

  const updateSiteSettings = useCallback((settings: SiteSettings) => {
    setSiteSettings(settings);
    saveSiteData({ siteSettings: settings });
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
        isLoading,
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
