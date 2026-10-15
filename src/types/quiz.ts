export type RepairScope = 'whole_flat' | 'single_room' | 'engineering';
export type RoomType = 'bathroom' | 'kitchen' | 'bedroom' | 'balcony';
export type EngineeringType = 'electric' | 'plumbing' | 'tile';
export type RepairType = 'cosmetic' | 'capital' | 'designer';
export type PropertyType = 'new' | 'secondary';
export type LutskDistrict = 'center' | 'district_33_40' | 'lpz' | 'kovelska' | 'suburb';
export type AddonKey = 'dismantling' | 'materials_procurement' | 'design_supervision';
export type StartDateOption = 'asap' | 'month' | 'pricing';

export interface QuizState {
  scope: RepairScope;
  repairType: RepairType;
  roomType: RoomType;
  engineeringType: EngineeringType;
  propertyType: PropertyType;
  areaM2: number;
  addons: AddonKey[];
  contact: {
    name: string;
    phone: string;
    district: LutskDistrict;
    startDate?: StartDateOption;
  };
}

export interface WebhookPayload {
  user: {
    id: number | string;
    username: string;
    first_name: string;
  };
  quiz: {
    scope: RepairScope;
    repair_type: RepairType;
    room_type: RoomType;
    engineering_type: EngineeringType;
    property_type: PropertyType;
    area_m2: number;
    addons: AddonKey[];
    district: LutskDistrict;
    start_date?: StartDateOption;
  };
  contact: {
    name: string;
    phone: string;
    district: LutskDistrict;
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
  baseCost: number;
  addonsTotal: number;
  totalAmount: number;
  totalFormatted: string;
  itemDescription?: string;
}
