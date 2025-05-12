
import { supabase } from '@/lib/supabase';
import { HospitalRequest } from '@/types/database.types';

export const hospitalService = {
  // Get all hospital requests
  getAllRequests: async () => {
    const { data, error } = await supabase
      .from('hospital_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as HospitalRequest[];
  },
  
  // Add new hospital request
  addRequest: async (request: Omit<HospitalRequest, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('hospital_requests')
      .insert([request])
      .select();
    
    if (error) throw error;
    return data[0] as HospitalRequest;
  },
  
  // Update request status
  updateRequestStatus: async (id: string, status: HospitalRequest['status']) => {
    const { data, error } = await supabase
      .from('hospital_requests')
      .update({ status })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as HospitalRequest;
  },
  
  // Get requests by status
  getRequestsByStatus: async (status: HospitalRequest['status']) => {
    const { data, error } = await supabase
      .from('hospital_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as HospitalRequest[];
  },
};
