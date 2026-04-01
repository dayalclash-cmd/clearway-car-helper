export interface Package {
  id: string;
  name: string;
  price: string;
  perBooking?: string;
  badge?: string;
  isHighlighted?: boolean;
  description?: string;
  details?: string;
  includes?: string[];
  includesLabel?: string;
  supportItems?: string[];
  supportLabel?: string;
  valueAdd?: string;
  disclaimer: string;
}

export interface SiteSettings {
  email: string;
  phone: string;
  phoneDisplay: string;
  businessName: string;
  tagline: string;
  maintenanceMode?: boolean;
}
