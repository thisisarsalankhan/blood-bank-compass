
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangleIcon, CheckCircle2Icon, ClockIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock hospital request data
const mockRequests = [
  {
    id: '1',
    hospitalName: 'City General Hospital',
    requestDate: '2024-04-03',
    bloodType: 'O+',
    units: 5,
    status: 'approved',
    urgency: 'normal',
    contactPerson: 'Dr. Smith',
    contactNumber: '555-123-4567',
    notes: 'Scheduled surgery',
  },
  {
    id: '2',
    hospitalName: 'Memorial Hospital',
    requestDate: '2024-04-04',
    bloodType: 'AB-',
    units: 2,
    status: 'pending',
    urgency: 'urgent',
    contactPerson: 'Dr. Johnson',
    contactNumber: '555-234-5678',
    notes: 'Emergency case',
  },
  {
    id: '3',
    hospitalName: 'Community Medical Center',
    requestDate: '2024-04-02',
    bloodType: 'A+',
    units: 3,
    status: 'completed',
    urgency: 'normal',
    contactPerson: 'Nurse Williams',
    contactNumber: '555-345-6789',
    notes: '',
  },
  {
    id: '4',
    hospitalName: 'University Hospital',
    requestDate: '2024-04-05',
    bloodType: 'B+',
    units: 4,
    status: 'pending',
    urgency: 'critical',
    contactPerson: 'Dr. Lee',
    contactNumber: '555-456-7890',
    notes: 'Multiple trauma patients',
  },
  {
    id: '5',
    hospitalName: 'St. Mary\'s Hospital',
    requestDate: '2024-04-01',
    bloodType: 'O-',
    units: 2,
    status: 'approved',
    urgency: 'normal',
    contactPerson: 'Dr. Garcia',
    contactNumber: '555-567-8901',
    notes: 'Scheduled transfusion',
  },
];

// Mock hospitals data
const mockHospitals = [
  { id: '1', name: 'City General Hospital', address: '123 Main St, Cityville', contact: '555-123-4567' },
  { id: '2', name: 'Memorial Hospital', address: '456 Oak Ave, Townsburg', contact: '555-234-5678' },
  { id: '3', name: 'Community Medical Center', address: '789 Elm Dr, Springfield', contact: '555-345-6789' },
  { id: '4', name: 'University Hospital', address: '101 College Rd, Academiaville', contact: '555-456-7890' },
  { id: '5', name: 'St. Mary\'s Hospital', address: '202 Church St, Faithburg', contact: '555-567-8901' },
  { id: '6', name: 'Northeast Regional Medical', address: '303 Region Blvd, Northtown', contact: '555-678-9012' },
  { id: '7', name: 'Westside Health Center', address: '404 Sunset Ave, Westville', contact: '555-789-0123' },
];

const HospitalRequests = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [hospitals, setHospitals] = useState(mockHospitals);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  // New request form state
  const [newRequest, setNewRequest] = useState({
    hospitalId: '',
    bloodType: '',
    units: '',
    urgency: 'normal',
    contactPerson: '',
    contactNumber: '',
    notes: '',
  });

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle creating a new request
  const handleCreateRequest = () => {
    // Validate form
    if (!newRequest.hospitalId || !newRequest.bloodType || !newRequest.units || 
        !newRequest.contactPerson || !newRequest.contactNumber) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    const selectedHospital = hospitals.find(h => h.id === newRequest.hospitalId);
    if (!selectedHospital) return;
    
    // Add new request
    const newRequestItem = {
      id: (requests.length + 1).toString(),
      hospitalName: selectedHospital.name,
      requestDate: new Date().toISOString().split('T')[0],
      bloodType: newRequest.bloodType,
      units: parseInt(newRequest.units, 10),
      status: 'pending',
      urgency: newRequest.urgency,
      contactPerson: newRequest.contactPerson,
      contactNumber: newRequest.contactNumber,
      notes: newRequest.notes,
    };
    
    setRequests([newRequestItem, ...requests]);
    setIsNewRequestDialogOpen(false);
    
    // Reset form
    setNewRequest({
      hospitalId: '',
      bloodType: '',
      units: '',
      urgency: 'normal',
      contactPerson: '',
      contactNumber: '',
      notes: '',
    });
    
    toast({
      title: "Request created successfully",
      description: `Blood request from ${selectedHospital.name} has been submitted.`,
    });
  };

  // Handle updating request status
  const handleUpdateStatus = (requestId: string, newStatus: string) => {
    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus,
        };
      }
      return request;
    });
    
    setRequests(updatedRequests);
    setIsViewDetailsDialogOpen(false);
    
    toast({
      title: "Request status updated",
      description: `Request has been marked as ${newStatus}.`,
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Approved</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get urgency badge and icon
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return (
          <div className="flex items-center">
            <AlertTriangleIcon size={16} className="mr-1 text-red-600" />
            <Badge className="bg-red-500">Critical</Badge>
          </div>
        );
      case 'urgent':
        return (
          <div className="flex items-center">
            <ClockIcon size={16} className="mr-1 text-yellow-600" />
            <Badge className="bg-yellow-500">Urgent</Badge>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <CheckCircle2Icon size={16} className="mr-1 text-green-600" />
            <Badge className="bg-green-500">Normal</Badge>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Requests</h1>
          <p className="text-muted-foreground mt-2">
            Manage blood requests from hospitals and medical facilities
          </p>
        </div>
        
        <Button 
          onClick={() => setIsNewRequestDialogOpen(true)}
          className="bg-bloodRed hover:bg-bloodRed/90"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="hospitals">Registered Hospitals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Blood Requests</CardTitle>
                  <CardDescription>View and manage blood requests from hospitals</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-auto"
                    />
                  </div>
                  
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[130px]">
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                      <TableHead>Hospital</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Blood Type</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No requests found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.hospitalName}</TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                              {request.bloodType}
                            </Badge>
                          </TableCell>
                          <TableCell>{request.units}</TableCell>
                          <TableCell>
                            {getUrgencyBadge(request.urgency)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsViewDetailsDialogOpen(true);
                              }}
                            >
                              View Details
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
        </TabsContent>
        
        <TabsContent value="hospitals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Hospitals</CardTitle>
              <CardDescription>Medical facilities registered for blood requests</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hospitals.map((hospital) => (
                      <TableRow key={hospital.id}>
                        <TableCell className="font-medium">{hospital.name}</TableCell>
                        <TableCell>{hospital.address}</TableCell>
                        <TableCell>{hospital.contact}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewRequest({
                                ...newRequest,
                                hospitalId: hospital.id,
                              });
                              setIsNewRequestDialogOpen(true);
                            }}
                          >
                            Create Request
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Request Dialog */}
      <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Blood Request</DialogTitle>
            <DialogDescription>
              Submit a new request for blood units from a hospital.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="hospital" className="text-sm font-medium">Hospital</label>
              <Select
                value={newRequest.hospitalId}
                onValueChange={(value) => setNewRequest({ ...newRequest, hospitalId: value })}
              >
                <SelectTrigger id="hospital">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>{hospital.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="bloodType" className="text-sm font-medium">Blood Type</label>
                <Select
                  value={newRequest.bloodType}
                  onValueChange={(value) => setNewRequest({ ...newRequest, bloodType: value })}
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
                <label htmlFor="units" className="text-sm font-medium">Units Required</label>
                <Input
                  id="units"
                  type="number"
                  value={newRequest.units}
                  onChange={(e) => setNewRequest({ ...newRequest, units: e.target.value })}
                  placeholder="Number of units"
                  min="1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Urgency Level</label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={newRequest.urgency === 'normal' ? "default" : "outline"}
                  className={newRequest.urgency === 'normal' ? "bg-green-600" : "bg-white"}
                  onClick={() => setNewRequest({ ...newRequest, urgency: 'normal' })}
                >
                  Normal
                </Button>
                <Button
                  type="button"
                  variant={newRequest.urgency === 'urgent' ? "default" : "outline"}
                  className={newRequest.urgency === 'urgent' ? "bg-yellow-600" : "bg-white"}
                  onClick={() => setNewRequest({ ...newRequest, urgency: 'urgent' })}
                >
                  Urgent
                </Button>
                <Button
                  type="button"
                  variant={newRequest.urgency === 'critical' ? "default" : "outline"}
                  className={newRequest.urgency === 'critical' ? "bg-red-600" : "bg-white"}
                  onClick={() => setNewRequest({ ...newRequest, urgency: 'critical' })}
                >
                  Critical
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactPerson" className="text-sm font-medium">Contact Person</label>
              <Input
                id="contactPerson"
                value={newRequest.contactPerson}
                onChange={(e) => setNewRequest({ ...newRequest, contactPerson: e.target.value })}
                placeholder="Doctor or staff name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</label>
              <Input
                id="contactNumber"
                value={newRequest.contactNumber}
                onChange={(e) => setNewRequest({ ...newRequest, contactNumber: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Additional Notes</label>
              <Textarea
                id="notes"
                value={newRequest.notes}
                onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                placeholder="Reason for request or special instructions"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRequestDialogOpen(false)}>Cancel</Button>
            <Button 
              className="bg-bloodRed hover:bg-bloodRed/90" 
              onClick={handleCreateRequest}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Request Details</DialogTitle>
                <DialogDescription>
                  Details for blood request from {selectedRequest.hospitalName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRequest.hospitalName}</h3>
                    <p className="text-sm text-muted-foreground">Request ID: #{selectedRequest.id}</p>
                  </div>
                  <div>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Request Date</p>
                    <p>{selectedRequest.requestDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Urgency</p>
                    <div>{getUrgencyBadge(selectedRequest.urgency)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 mt-1">
                      {selectedRequest.bloodType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Units Requested</p>
                    <p>{selectedRequest.units}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Person</p>
                    <p>{selectedRequest.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Number</p>
                    <p>{selectedRequest.contactNumber}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="p-2 bg-muted rounded-md mt-1">
                    {selectedRequest.notes || 'No additional notes provided.'}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-2 w-full">
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 flex-1" 
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'approved')}
                    >
                      Approve
                    </Button>
                  </div>
                )}
                
                {selectedRequest.status === 'approved' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700 w-full" 
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
                
                {(selectedRequest.status === 'completed' || selectedRequest.status === 'rejected') && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsViewDetailsDialogOpen(false)}
                  >
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalRequests;
