export type RepairType = 'cosmetic' | 'capital' | 'designer';
export type PropertyType = 'new' | 'secondary';
export type AddonKey = 'design_project' | 'electric_plumbing' | 'materials_delivery';
export type StartDateOption = 'asap' | 'month' | 'pricing';

export interface QuizState {
  repairType: RepairType;
  propertyType: PropertyType;
  areaM2: number;
  addons: AddonKey[];
  name: string;
  phone: string;
  startDate: StartDateOption;
}

export interface WebhookPayload {
  user: {
    id: number | string;
    username: string;
    first_name: string;
  };
  quiz: {
    repair_type: RepairType;
    property_type: PropertyType;
    area_m2: number;
    addons: AddonKey[];
    start_date: StartDateOption;
  };
  contact: {
    name: string;
    phone: string;
  };
}

export interface WebhookResponse {
  success?: boolean;
  totalFormatted?: string;
  totalAmount?: number;
  timestamp?: string;
  message?: string;
}

export interface CalculationBreakdown {
  baseRate: number;
  multiplier: number;
  baseCost: number;
  addonsTotal: number;
  totalAmount: number;
  totalFormatted: string;
}
