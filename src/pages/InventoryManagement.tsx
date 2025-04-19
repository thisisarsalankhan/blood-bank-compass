import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BloodStockCard } from '@/components/inventory/BloodStockCard';
import { InventoryStats } from '@/components/inventory/InventoryStats';
import { BloodComponentForm } from '@/components/inventory/BloodComponentForm';

// Mock inventory data
const mockInventory = [
  {
    id: '1',
    bloodType: 'A+',
    units: 45,
    location: 'Main Storage',
    expiryDate: '2024-05-15',
    status: 'available',
    donationDate: '2024-04-01',
    component: 'Whole Blood'
  },
  {
    id: '2',
    bloodType: 'B+',
    units: 38,
    location: 'Main Storage',
    expiryDate: '2024-05-10',
    status: 'available',
    donationDate: '2024-03-28',
    component: 'Whole Blood'
  },
  {
    id: '3',
    bloodType: 'AB+',
    units: 12,
    location: 'Cold Storage 2',
    expiryDate: '2024-05-18',
    status: 'available',
    donationDate: '2024-04-03',
    component: 'Plasma'
  },
  {
    id: '4',
    bloodType: 'O+',
    units: 52,
    location: 'Main Storage',
    expiryDate: '2024-05-20',
    status: 'available',
    donationDate: '2024-04-05',
    component: 'Whole Blood'
  },
  {
    id: '5',
    bloodType: 'A-',
    units: 18,
    location: 'Cold Storage 1',
    expiryDate: '2024-05-12',
    status: 'reserved',
    donationDate: '2024-03-30',
    component: 'Platelets'
  },
  {
    id: '6',
    bloodType: 'B-',
    units: 15,
    location: 'Cold Storage 1',
    expiryDate: '2024-05-16',
    status: 'available',
    donationDate: '2024-04-02',
    component: 'Red Blood Cells'
  },
  {
    id: '7',
    bloodType: 'AB-',
    units: 8,
    location: 'Cold Storage 2',
    expiryDate: '2024-05-08',
    status: 'available',
    donationDate: '2024-03-25',
    component: 'Plasma'
  },
  {
    id: '8',
    bloodType: 'O-',
    units: 25,
    location: 'Main Storage',
    expiryDate: '2024-05-22',
    status: 'available',
    donationDate: '2024-04-07',
    component: 'Whole Blood'
  },
];

// Mock transactions data
const mockTransactions = [
  {
    id: '1',
    date: '2024-04-05',
    type: 'incoming',
    bloodType: 'A+',
    units: 10,
    source: 'Community Drive',
    destination: 'Main Storage',
  },
  {
    id: '2',
    date: '2024-04-04',
    type: 'outgoing',
    bloodType: 'O+',
    units: 5,
    source: 'Main Storage',
    destination: 'City Hospital',
  },
  {
    id: '3',
    date: '2024-04-03',
    type: 'incoming',
    bloodType: 'B-',
    units: 8,
    source: 'Red Cross',
    destination: 'Cold Storage 1',
  },
  {
    id: '4',
    date: '2024-04-02',
    type: 'outgoing',
    bloodType: 'AB+',
    units: 3,
    source: 'Cold Storage 2',
    destination: 'Memorial Hospital',
  },
  {
    id: '5',
    date: '2024-04-01',
    type: 'incoming',
    bloodType: 'O-',
    units: 12,
    source: 'Blood Drive',
    destination: 'Main Storage',
  },
];

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const { toast } = useToast();

  // New inventory form state
  const [newInventory, setNewInventory] = useState({
    bloodType: '',
    units: '',
    location: '',
    donationDate: new Date().toISOString().split('T')[0],
    source: '',
  });

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    type: 'incoming',
    bloodType: '',
    units: '',
    source: '',
    destination: '',
  });

  // Filter inventory based on search and filters
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBloodType = bloodTypeFilter === 'all' || item.bloodType === bloodTypeFilter;
    
    return matchesSearch && matchesBloodType;
  });

  // Handle adding new inventory
  const handleAddInventory = (data: any) => {
    const newItem = {
      id: `${inventory.length + 1}`,
      bloodType: data.bloodType,
      units: parseInt(data.units),
      location: data.location,
      expiryDate: data.expiryDate,
      status: 'available',
      donationDate: data.donationDate,
      component: data.component || 'Whole Blood'
    };
    
    setInventory([...inventory, newItem]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Inventory Added",
      description: `${data.units} units of ${data.bloodType} ${data.component} added to inventory.`,
    });
  };

  // Handle adding new transaction
  const handleAddTransaction = () => {
    if (!newTransaction.bloodType || !newTransaction.units || !newTransaction.source || !newTransaction.destination) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newItem = {
      id: `${transactions.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      type: newTransaction.type,
      bloodType: newTransaction.bloodType,
      units: parseInt(newTransaction.units),
      source: newTransaction.source,
      destination: newTransaction.destination
    };
    
    setTransactions([newItem, ...transactions]);
    
    // Update inventory if it's an outgoing transaction
    if (newTransaction.type === 'outgoing') {
      const updatedInventory = inventory.map(item => {
        if (item.bloodType === newTransaction.bloodType) {
          return {
            ...item,
            units: Math.max(0, item.units - parseInt(newTransaction.units))
          };
        }
        return item;
      });
      setInventory(updatedInventory);
    }
    
    setIsTransactionDialogOpen(false);
    
    toast({
      title: newTransaction.type === 'incoming' ? "Blood Received" : "Blood Dispatched",
      description: `${newTransaction.units} units of ${newTransaction.bloodType} ${newTransaction.type === 'incoming' ? 'received from' : 'dispatched to'} ${newTransaction.type === 'incoming' ? newTransaction.source : newTransaction.destination}.`,
    });
  };

  const calculateStats = () => {
    const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
    const criticalTypes = inventory.filter(item => item.units < 10).map(item => item.bloodType);
    const expiringUnits = inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7;
    }).length;

    const bloodTypeDistribution = Array.from(
      new Set(inventory.map(item => item.bloodType))
    ).map(type => ({
      name: type,
      value: inventory
        .filter(item => item.bloodType === type)
        .reduce((sum, item) => sum + item.units, 0)
    }));

    return {
      totalUnits,
      criticalTypes,
      expiringUnits,
      bloodTypeDistribution
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage blood inventory and transactions
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsTransactionDialogOpen(true)}
          >
            Record Transaction
          </Button>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-bloodRed hover:bg-bloodRed/90"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Inventory
          </Button>
        </div>
      </div>

      <InventoryStats {...stats} />

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Inventory</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Blood Inventory</CardTitle>
                  <CardDescription>View and manage blood units in storage</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-auto"
                    />
                  </div>
                  
                  <Select
                    value={bloodTypeFilter}
                    onValueChange={setBloodTypeFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Blood Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInventory.map((item) => (
                  <BloodStockCard
                    key={item.id}
                    bloodType={item.bloodType}
                    units={item.units}
                    location={item.location}
                    expiryDate={item.expiryDate}
                    status={item.status}
                    component={item.component || "Whole Blood"}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Record of all blood inventory movements</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No transactions recorded yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={transaction.type === 'incoming' ? 'default' : 'secondary'}
                              className={
                                transaction.type === 'incoming'
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                              }
                            >
                              {transaction.type === 'incoming' ? 'Received' : 'Dispatched'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                              {transaction.bloodType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{transaction.units}</TableCell>
                          <TableCell>{transaction.source}</TableCell>
                          <TableCell>{transaction.destination}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BloodComponentForm 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddInventory}
      />

      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Transaction</DialogTitle>
            <DialogDescription>
              Record incoming or outgoing blood units.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Type</label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={newTransaction.type === 'incoming' ? "default" : "outline"}
                  className={newTransaction.type === 'incoming' ? "bg-green-600" : "bg-white"}
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'incoming' })}
                >
                  Incoming
                </Button>
                <Button
                  type="button"
                  variant={newTransaction.type === 'outgoing' ? "default" : "outline"}
                  className={newTransaction.type === 'outgoing' ? "bg-blue-600" : "bg-white"}
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'outgoing' })}
                >
                  Outgoing
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="txBloodType" className="text-sm font-medium">Blood Type</label>
                <Select
                  value={newTransaction.bloodType}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, bloodType: value })}
                >
                  <SelectTrigger id="txBloodType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="txUnits" className="text-sm font-medium">Units</label>
                <Input
                  id="txUnits"
                  type="number"
                  value={newTransaction.units}
                  onChange={(e) => setNewTransaction({ ...newTransaction, units: e.target.value })}
                  placeholder="Number of units"
                  min="1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="txSource" className="text-sm font-medium">
                {newTransaction.type === 'incoming' ? 'Source' : 'From Location'}
              </label>
              <Input
                id="txSource"
                value={newTransaction.source}
                onChange={(e) => setNewTransaction({ ...newTransaction, source: e.target.value })}
                placeholder={newTransaction.type === 'incoming' ? 'Donation drive, hospital, etc.' : 'Storage location'}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="txDestination" className="text-sm font-medium">
                {newTransaction.type === 'incoming' ? 'Destination' : 'To Hospital/Facility'}
              </label>
              <Input
                id="txDestination"
                value={newTransaction.destination}
                onChange={(e) => setNewTransaction({ ...newTransaction, destination: e.target.value })}
                placeholder={newTransaction.type === 'incoming' ? 'Storage location' : 'Hospital, clinic, etc.'}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>Cancel</Button>
            <Button 
              className={newTransaction.type === 'incoming' ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} 
              onClick={handleAddTransaction}
            >
              Record Transaction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
