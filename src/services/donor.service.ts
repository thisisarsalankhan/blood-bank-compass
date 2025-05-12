
import { supabase } from '@/lib/supabase';
import { Donor, BloodType, DonorStatus } from '@/types/database.types';

export const donorService = {
  // Get all donors
  getAllDonors: async () => {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Donor[];
  },
  
  // Get donors by blood type
  getDonorsByBloodType: async (bloodType: BloodType) => {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('blood_type', bloodType)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as Donor[];
  },
  
  // Add new donor
  addDonor: async (donor: Omit<Donor, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('donors')
      .insert([donor])
      .select();
    
    if (error) throw error;
    return data[0] as Donor;
  },
  
  // Update donor
  updateDonor: async (id: string, updates: Partial<Donor>) => {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as Donor;
  },
  
  // Record donation
  recordDonation: async (donorId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('donors')
      .update({
        last_donation: today,
        status: 'ineligible' as DonorStatus
      })
      .eq('id', donorId)
      .select();
    
    if (error) throw error;
    return data[0] as Donor;
  }
};
