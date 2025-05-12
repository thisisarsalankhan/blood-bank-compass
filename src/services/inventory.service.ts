
import { supabase } from '@/lib/supabase';
import { BloodInventory, BloodType, BloodComponent, StorageLocation } from '@/types/database.types';

export const inventoryService = {
  // Get all inventory items
  getAllInventory: async () => {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as BloodInventory[];
  },
  
  // Get inventory by blood type
  getByBloodType: async (bloodType: BloodType) => {
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .eq('blood_type', bloodType)
      .order('expiry_date', { ascending: true });
    
    if (error) throw error;
    return data as BloodInventory[];
  },
  
  // Add new blood component to inventory
  addInventory: async (inventoryItem: Omit<BloodInventory, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('blood_inventory')
      .insert([inventoryItem])
      .select();
    
    if (error) throw error;
    return data[0] as BloodInventory;
  },
  
  // Update inventory item
  updateInventory: async (id: string, updates: Partial<BloodInventory>) => {
    const { data, error } = await supabase
      .from('blood_inventory')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0] as BloodInventory;
  },
  
  // Get inventory statistics
  getInventoryStats: async () => {
    // Get total units
    const { data: totalData, error: totalError } = await supabase
      .from('blood_inventory')
      .select('units')
      .eq('status', 'available');
    
    if (totalError) throw totalError;
    const totalUnits = totalData.reduce((sum, item) => sum + (item.units || 0), 0);
    
    // Get critical types (less than 10 units)
    const { data: criticalData, error: criticalError } = await supabase
      .from('blood_inventory')
      .select('blood_type, units')
      .eq('status', 'available');
    
    if (criticalError) throw criticalError;
    
    const bloodTypeQuantities: Record<string, number> = {};
    criticalData.forEach((item) => {
      const type = item.blood_type;
      bloodTypeQuantities[type] = (bloodTypeQuantities[type] || 0) + item.units;
    });
    
    const criticalTypes = Object.entries(bloodTypeQuantities)
      .filter(([_, units]) => units < 10)
      .map(([type]) => type);
    
    // Get expiring units
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const { data: expiringData, error: expiringError } = await supabase
      .from('blood_inventory')
      .select('*')
      .lte('expiry_date', sevenDaysLater.toISOString().split('T')[0])
      .gte('expiry_date', today.toISOString().split('T')[0])
      .eq('status', 'available');
    
    if (expiringError) throw expiringError;
    const expiringUnits = expiringData.reduce((sum, item) => sum + item.units, 0);
    
    // Get blood type distribution
    const bloodTypeDistribution = Object.entries(bloodTypeQuantities).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      totalUnits,
      criticalTypes,
      expiringUnits,
      bloodTypeDistribution
    };
  }
};
