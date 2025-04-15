
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DropletIcon, AlertCircleIcon, CheckCircleIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';

// Mock data for the dashboard
const inventoryData = [
  { type: 'A+', units: 45, color: '#ef4444' },
  { type: 'B+', units: 38, color: '#3b82f6' },
  { type: 'AB+', units: 12, color: '#a855f7' },
  { type: 'O+', units: 52, color: '#10b981' },
  { type: 'A-', units: 18, color: '#f97316' },
  { type: 'B-', units: 15, color: '#0ea5e9' },
  { type: 'AB-', units: 8, color: '#8b5cf6' },
  { type: 'O-', units: 25, color: '#22c55e' },
];

const donationData = [
  { month: 'Jan', donations: 65 },
  { month: 'Feb', donations: 72 },
  { month: 'Mar', donations: 80 },
  { month: 'Apr', donations: 68 },
  { month: 'May', donations: 90 },
  { month: 'Jun', donations: 85 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalRequests: 0,
    pendingRequests: 0,
    criticalLevels: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we're using mock data
    setStats({
      totalDonations: 460,
      totalRequests: 312,
      pendingRequests: 18,
      criticalLevels: 2,
    });
  }, []);

  // Calculate total blood units
  const totalBloodUnits = inventoryData.reduce((sum, item) => sum + item.units, 0);
  
  // Calculate percentage for each blood type
  const pieData = inventoryData.map(item => ({
    ...item,
    percentage: ((item.units / totalBloodUnits) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name}. Here's an overview of your blood bank.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                <p className="text-3xl font-bold">{stats.totalDonations}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <DropletIcon size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-green-600">
              <TrendingUpIcon size={16} className="mr-1" />
              <span>12% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Requests</p>
                <p className="text-3xl font-bold">{stats.totalRequests}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <CheckCircleIcon size={20} className="text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-red-600">
              <TrendingDownIcon size={16} className="mr-1" />
              <span>3% decrease</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-bold">{stats.pendingRequests}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertCircleIcon size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-muted-foreground">
              <span>Last updated: 2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Levels</p>
                <p className="text-3xl font-bold">{stats.criticalLevels}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircleIcon size={20} className="text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-red-600 font-medium">
              <span>AB- and B- low stock!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blood Inventory</CardTitle>
            <CardDescription>Current blood units by blood type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="units"
                  nameKey="type"
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value, name, props) => [`${value} units`, props.payload.type]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Donations</CardTitle>
            <CardDescription>Donation trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#E53935" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Blood inventory levels */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Type Inventory Levels</CardTitle>
          <CardDescription>Current stock levels and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryData.map((item) => {
              const level = item.units <= 10 ? 'Critical' : item.units <= 20 ? 'Low' : 'Normal';
              const levelColor = 
                level === 'Critical' ? 'text-red-600' : 
                level === 'Low' ? 'text-yellow-600' : 
                'text-green-600';
              
              const progress = Math.min(100, (item.units / 60) * 100);
              
              return (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <DropletIcon size={16} style={{ color: item.color }} className="mr-2" />
                      <span className="font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm ${levelColor} font-medium`}>{level}</span>
                      <span className="text-sm font-medium">{item.units} units</span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" 
                    style={{ 
                      '--progress-background': item.color,
                    } as React.CSSProperties}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
