
import { supabase } from '@/lib/supabase';
import { InventoryTransaction, TransactionType } from '@/types/database.types';

export const transactionService = {
  // Get all transactions
  getAllTransactions: async () => {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as InventoryTransaction[];
  },
  
  // Add new transaction
  addTransaction: async (transaction: Omit<InventoryTransaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .insert([transaction])
      .select();
    
    if (error) throw error;
    return data[0] as InventoryTransaction;
  },
  
  // Get transactions by type
  getTransactionsByType: async (type: TransactionType) => {
    const { data, error } = await supabase
      .from('inventory_transactions')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as InventoryTransaction[];
  },
};
