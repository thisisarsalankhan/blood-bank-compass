
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircleIcon, SearchIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  },
  {
    id: '2',
    bloodType: 'B+',
    units: 38,
    location: 'Main Storage',
    expiryDate: '2024-05-10',
    status: 'available',
    donationDate: '2024-03-28',
  },
  {
    id: '3',
    bloodType: 'AB+',
    units: 12,
    location: 'Cold Storage 2',
    expiryDate: '2024-05-18',
    status: 'available',
    donationDate: '2024-04-03',
  },
  {
    id: '4',
    bloodType: 'O+',
    units: 52,
    location: 'Main Storage',
    expiryDate: '2024-05-20',
    status: 'available',
    donationDate: '2024-04-05',
  },
  {
    id: '5',
    bloodType: 'A-',
    units: 18,
    location: 'Cold Storage 1',
    expiryDate: '2024-05-12',
    status: 'reserved',
    donationDate: '2024-03-30',
  },
  {
    id: '6',
    bloodType: 'B-',
    units: 15,
    location: 'Cold Storage 1',
    expiryDate: '2024-05-16',
    status: 'available',
    donationDate: '2024-04-02',
  },
  {
    id: '7',
    bloodType: 'AB-',
    units: 8,
    location: 'Cold Storage 2',
    expiryDate: '2024-05-08',
    status: 'available',
    donationDate: '2024-03-25',
  },
  {
    id: '8',
    bloodType: 'O-',
    units: 25,
    location: 'Main Storage',
    expiryDate: '2024-05-22',
    status: 'available',
    donationDate: '2024-04-07',
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

  // Calculate inventory stats
  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalTypes = inventory.filter(item => item.units < 10).map(item => item.bloodType);
  
  // Handle adding new inventory
  const handleAddInventory = () => {
    // Validate form
    if (!newInventory.bloodType || !newInventory.units || !newInventory.location) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Calculate expiry date (typically 42 days from donation)
    const donationDate = new Date(newInventory.donationDate);
    const expiryDate = new Date(donationDate);
    expiryDate.setDate(donationDate.getDate() + 42);
    
    // Add new inventory
    const newItem = {
      id: (inventory.length + 1).toString(),
      bloodType: newInventory.bloodType,
      units: parseInt(newInventory.units, 10),
      location: newInventory.location,
      expiryDate: expiryDate.toISOString().split('T')[0],
      status: 'available',
      donationDate: newInventory.donationDate,
    };
    
    setInventory([...inventory, newItem]);
    
    // Add corresponding transaction
    const newTransactionItem = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'incoming',
      bloodType: newInventory.bloodType,
      units: parseInt(newInventory.units, 10),
      source: newInventory.source || 'Unknown Source',
      destination: newInventory.location,
    };
    
    setTransactions([...transactions, newTransactionItem]);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewInventory({
      bloodType: '',
      units: '',
      location: '',
      donationDate: new Date().toISOString().split('T')[0],
      source: '',
    });
    
    toast({
      title: "Inventory added successfully",
      description: `${newInventory.units} units of ${newInventory.bloodType} blood added to inventory.`,
    });
  };

  // Handle adding a new transaction
  const handleAddTransaction = () => {
    // Validate form
    if (!newTransaction.bloodType || !newTransaction.units || 
        !newTransaction.source || !newTransaction.destination) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    const units = parseInt(newTransaction.units, 10);
    
    // Update inventory based on transaction type
    if (newTransaction.type === 'outgoing') {
      // Check if enough units are available
      const bloodTypeInventory = inventory.filter(item => 
        item.bloodType === newTransaction.bloodType && item.status === 'available'
      );
      
      const availableUnits = bloodTypeInventory.reduce((sum, item) => sum + item.units, 0);
      
      if (availableUnits < units) {
        toast({
          variant: "destructive",
          title: "Insufficient inventory",
          description: `Only ${availableUnits} units of ${newTransaction.bloodType} available.`,
        });
        return;
      }
      
      // Update inventory
      let remainingUnits = units;
      const updatedInventory = inventory.map(item => {
        if (item.bloodType === newTransaction.bloodType && 
            item.status === 'available' && 
            remainingUnits > 0) {
          
          if (item.units <= remainingUnits) {
            // Use all units from this item
            remainingUnits -= item.units;
            return {
              ...item,
              units: 0,
              status: 'depleted',
            };
          } else {
            // Use partial units from this item
            return {
              ...item,
              units: item.units - remainingUnits,
            };
          }
        }
        return item;
      }).filter(item => item.units > 0); // Remove depleted items
      
      setInventory(updatedInventory);
    }
    
    // Add transaction record
    const newTransactionItem = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      type: newTransaction.type,
      bloodType: newTransaction.bloodType,
      units: units,
      source: newTransaction.source,
      destination: newTransaction.destination,
    };
    
    setTransactions([...transactions, newTransactionItem]);
    setIsTransactionDialogOpen(false);
    
    // Reset form
    setNewTransaction({
      type: 'incoming',
      bloodType: '',
      units: '',
      source: '',
      destination: '',
    });
    
    toast({
      title: "Transaction recorded successfully",
      description: `${newTransaction.type === 'incoming' ? 'Received' : 'Dispatched'} ${units} units of ${newTransaction.bloodType} blood.`,
    });
  };

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

      {/* Inventory Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Total Blood Units</p>
              <p className="text-3xl font-bold">{totalUnits}</p>
              <p className="text-sm text-muted-foreground mt-2">Across all blood types</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Critical Stock</p>
              <p className="text-3xl font-bold">{criticalTypes.length}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {criticalTypes.length > 0 
                  ? `Low: ${criticalTypes.join(', ')}` 
                  : 'All blood types at healthy levels'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground">Recent Transactions</p>
              <p className="text-3xl font-bold">{transactions.slice(0, 5).length}</p>
              <p className="text-sm text-muted-foreground mt-2">In the last 7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Donation Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No inventory items found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInventory.map((item) => {
                        const expiryDate = new Date(item.expiryDate);
                        const today = new Date();
                        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                        const isNearExpiry = daysUntilExpiry <= 7;
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                                {item.bloodType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.units < 10 ? (
                                <div className="flex items-center">
                                  <span>{item.units}</span>
                                  {item.units < 5 && (
                                    <AlertCircleIcon size={16} className="ml-2 text-red-500" />
                                  )}
                                </div>
                              ) : (
                                item.units
                              )}
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>{item.donationDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <span>{item.expiryDate}</span>
                                {isNearExpiry && (
                                  <span className="ml-2 text-xs text-red-500">
                                    ({daysUntilExpiry} days)
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={item.status === 'available' ? 'default' : 'secondary'}
                                className={
                                  item.status === 'available' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-100' 
                                    : item.status === 'reserved'
                                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                                }
                              >
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
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

      {/* Add Inventory Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Inventory</DialogTitle>
            <DialogDescription>
              Add new blood units to the inventory system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="bloodType" className="text-sm font-medium">Blood Type</label>
                <Select
                  value={newInventory.bloodType}
                  onValueChange={(value) => setNewInventory({ ...newInventory, bloodType: value })}
                >
                  <SelectTrigger id="bloodType">
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
                <label htmlFor="units" className="text-sm font-medium">Units</label>
                <Input
                  id="units"
                  type="number"
                  value={newInventory.units}
                  onChange={(e) => setNewInventory({ ...newInventory, units: e.target.value })}
                  placeholder="Number of units"
                  min="1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Storage Location</label>
              <Select
                value={newInventory.location}
                onValueChange={(value) => setNewInventory({ ...newInventory, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Storage">Main Storage</SelectItem>
                  <SelectItem value="Cold Storage 1">Cold Storage 1</SelectItem>
                  <SelectItem value="Cold Storage 2">Cold Storage 2</SelectItem>
                  <SelectItem value="Mobile Unit">Mobile Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="donationDate" className="text-sm font-medium">Donation Date</label>
              <Input
                id="donationDate"
                type="date"
                value={newInventory.donationDate}
                onChange={(e) => setNewInventory({ ...newInventory, donationDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium">Source</label>
              <Input
                id="source"
                value={newInventory.source}
                onChange={(e) => setNewInventory({ ...newInventory, source: e.target.value })}
                placeholder="Donation drive, hospital, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button className="bg-bloodRed hover:bg-bloodRed/90" onClick={handleAddInventory}>
              Add to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
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
