
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodComponent = 'Whole Blood' | 'Red Blood Cells' | 'Plasma' | 'Platelets';
export type StorageLocation = 'Main Storage' | 'Cold Storage 1' | 'Cold Storage 2' | 'Mobile Unit';
export type TransactionType = 'incoming' | 'outgoing';
export type DonorStatus = 'eligible' | 'ineligible';

export interface Profile {
  id: string;
  updated_at?: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'donor';
}

export interface BloodInventory {
  id: string;
  created_at: string;
  blood_type: BloodType;
  component: BloodComponent;
  units: number;
  location: StorageLocation;
  expiry_date: string;
  donation_date: string;
  status: 'available' | 'reserved' | 'used';
  source: string;
}

export interface Donor {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  blood_type: BloodType;
  last_donation: string | null;
  status: DonorStatus;
}

export interface InventoryTransaction {
  id: string;
  created_at: string;
  type: TransactionType;
  blood_type: BloodType;
  component: BloodComponent;
  units: number;
  source: string;
  destination: string;
}

export interface HospitalRequest {
  id: string;
  created_at: string;
  hospital_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  blood_type: BloodType;
  component: BloodComponent;
  units_requested: number;
  urgency: 'normal' | 'urgent' | 'critical';
  status: 'pending' | 'approved' | 'fulfilled' | 'rejected';
  notes: string;
}
