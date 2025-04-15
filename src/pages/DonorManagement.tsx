
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, FilterIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock donor data
const mockDonors = [
  {
    id: '1',
    name: 'John Doe',
    bloodType: 'A+',
    phone: '555-123-4567',
    email: 'john.doe@example.com',
    lastDonation: '2023-11-15',
    status: 'eligible',
  },
  {
    id: '2',
    name: 'Jane Smith',
    bloodType: 'O-',
    phone: '555-987-6543',
    email: 'jane.smith@example.com',
    lastDonation: '2023-12-01',
    status: 'eligible',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    bloodType: 'B+',
    phone: '555-456-7890',
    email: 'robert.j@example.com',
    lastDonation: '2023-09-22',
    status: 'ineligible',
  },
  {
    id: '4',
    name: 'Emily Davis',
    bloodType: 'AB+',
    phone: '555-789-0123',
    email: 'emily.d@example.com',
    lastDonation: '2023-10-18',
    status: 'eligible',
  },
  {
    id: '5',
    name: 'Michael Brown',
    bloodType: 'A-',
    phone: '555-234-5678',
    email: 'michael.b@example.com',
    lastDonation: '2023-08-30',
    status: 'ineligible',
  },
];

const DonorManagement = () => {
  const [donors, setDonors] = useState(mockDonors);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewDonorDialogOpen, setIsNewDonorDialogOpen] = useState(false);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<any>(null);
  const { toast } = useToast();

  // New donor form state
  const [newDonor, setNewDonor] = useState({
    name: '',
    bloodType: '',
    phone: '',
    email: '',
  });

  // Filter donors based on search and filters
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBloodType = bloodTypeFilter === 'all' || donor.bloodType === bloodTypeFilter;
    const matchesStatus = statusFilter === 'all' || donor.status === statusFilter;
    
    return matchesSearch && matchesBloodType && matchesStatus;
  });

  // Handle adding a new donor
  const handleAddDonor = () => {
    // Validate form
    if (!newDonor.name || !newDonor.bloodType || !newDonor.phone || !newDonor.email) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Add new donor
    const newDonorRecord = {
      id: (donors.length + 1).toString(),
      ...newDonor,
      lastDonation: 'Never',
      status: 'eligible',
    };
    
    setDonors([...donors, newDonorRecord]);
    setIsNewDonorDialogOpen(false);
    
    // Reset form
    setNewDonor({
      name: '',
      bloodType: '',
      phone: '',
      email: '',
    });
    
    toast({
      title: "Donor added successfully",
      description: `${newDonor.name} has been added to the donor registry.`,
    });
  };

  // Handle recording a new donation
  const handleRecordDonation = () => {
    if (!selectedDonor) return;
    
    // Update donor's last donation date
    const updatedDonors = donors.map(donor => {
      if (donor.id === selectedDonor.id) {
        return {
          ...donor,
          lastDonation: new Date().toISOString().split('T')[0],
          status: 'ineligible', // Temporarily ineligible after donation
        };
      }
      return donor;
    });
    
    setDonors(updatedDonors);
    setIsDonationDialogOpen(false);
    setSelectedDonor(null);
    
    toast({
      title: "Donation recorded successfully",
      description: "The blood donation has been recorded in the system.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage donor records and blood donations
          </p>
        </div>
        
        <Button 
          onClick={() => setIsNewDonorDialogOpen(true)} 
          className="bg-bloodRed hover:bg-bloodRed/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Donor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donor Registry</CardTitle>
          <CardDescription>View and manage all registered blood donors</CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Search and filter */}
          <div className="flex flex-col mb-6 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Select
                value={bloodTypeFilter}
                onValueChange={setBloodTypeFilter}
              >
                <SelectTrigger className="w-[120px]">
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
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="eligible">Eligible</SelectItem>
                  <SelectItem value="ineligible">Ineligible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Donors table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No donors found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell className="font-medium">{donor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          {donor.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>{donor.phone}</div>
                        <div className="text-xs text-muted-foreground">{donor.email}</div>
                      </TableCell>
                      <TableCell>{donor.lastDonation}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={donor.status === 'eligible' ? 'default' : 'secondary'}
                          className={donor.status === 'eligible' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}
                        >
                          {donor.status === 'eligible' ? 'Eligible' : 'Ineligible'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={donor.status === 'ineligible'}
                          onClick={() => {
                            setSelectedDonor(donor);
                            setIsDonationDialogOpen(true);
                          }}
                        >
                          Record Donation
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add New Donor Dialog */}
      <Dialog open={isNewDonorDialogOpen} onOpenChange={setIsNewDonorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Donor</DialogTitle>
            <DialogDescription>
              Enter the donor's information to add them to the system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                value={newDonor.name}
                onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
                placeholder="Enter donor's full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bloodType" className="text-sm font-medium">Blood Type</label>
              <Select
                value={newDonor.bloodType}
                onValueChange={(value) => setNewDonor({ ...newDonor, bloodType: value })}
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
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
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input
                id="phone"
                value={newDonor.phone}
                onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                value={newDonor.email}
                onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDonorDialogOpen(false)}>Cancel</Button>
            <Button className="bg-bloodRed hover:bg-bloodRed/90" onClick={handleAddDonor}>
              Add Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record New Donation</DialogTitle>
            <DialogDescription>
              {selectedDonor && `Record a blood donation from ${selectedDonor.name} (${selectedDonor.bloodType})`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">Donor Information</h4>
              {selectedDonor && (
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedDonor.name}</p>
                  <p><strong>Blood Type:</strong> {selectedDonor.bloodType}</p>
                  <p><strong>Last Donation:</strong> {selectedDonor.lastDonation}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Donation Date</label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                readOnly
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDonationDialogOpen(false)}>Cancel</Button>
            <Button className="bg-bloodRed hover:bg-bloodRed/90" onClick={handleRecordDonation}>
              Record Donation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonorManagement;
