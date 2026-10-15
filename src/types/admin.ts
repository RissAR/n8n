export interface Lead {
  id: number;
  timestamp: string;
  userId: string;
  username: string;
  name: string;
  phone: string;
  repairType: string;
  propertyType: string;
  areaM2: string | number;
  addons: string;
  total: string;
  status: string;
}

export interface AdminLeadsResponse {
  success: boolean;
  count?: number;
  leads?: Lead[];
  message?: string;
}
