import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

// Mock data for individual employee
const mockEmployeeMoodData = [
  { name: 'Happy', value: 60, color: '#eab308' },
  { name: 'Good', value: 30, color: '#22c55e' },
  { name: 'Sad', value: 10, color: '#f97316' },
];

const mockEmployeeEnergyData = [
  { day: 'Mon', energy: 4.2 },
  { day: 'Tue', energy: 3.8 },
  { day: 'Wed', energy: 4.1 },
  { day: 'Thu', energy: 4.5 },
  { day: 'Fri', energy: 3.9 },
  { day: 'Sat', energy: 4.3 },
  { day: 'Sun', energy: 4.7 },
];

const mockEmployeeSatisfactionData = [
  { day: 'Mon', satisfaction: 4.0 },
  { day: 'Tue', satisfaction: 4.2 },
  { day: 'Wed', satisfaction: 3.8 },
  { day: 'Thu', satisfaction: 4.5 },
  { day: 'Fri', satisfaction: 4.1 },
  { day: 'Sat', satisfaction: 4.3 },
  { day: 'Sun', satisfaction: 4.6 },
];

// Mock employee data lookup
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@company.com', lastActive: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', lastActive: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', lastActive: '2024-01-13' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', lastActive: '2024-01-12' },
  { id: 5, name: 'David Brown', email: 'david@company.com', lastActive: '2024-01-11' },
  { id: 6, name: 'Emily Davis', email: 'emily@company.com', lastActive: '2024-01-10' },
];

const EmployeeDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const employee = mockEmployees.find(emp => emp.id === parseInt(id || ''));

  if (!employee) {
    return (
      <div className="min-h-screen grainy-bg flex items-center justify-center">
        <Card className="glass-modal border-vibe-glass-border">
          <CardContent className="p-8 text-center">
            <p className="font-dancing text-vibe-warm-brown text-xl mb-4">
              Employee not found
            </p>
            <Button
              onClick={() => navigate('/employee-list')}
              className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
            >
              Back to Employee List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-modal p-3 rounded-lg border border-vibe-glass-border">
          <p className="font-dancing text-vibe-warm-brown">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-modal p-3 rounded-lg border border-vibe-glass-border">
          <p className="font-dancing text-vibe-warm-brown">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen grainy-bg">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-vibe-glass-border">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/employee-list')}
            variant="outline"
            className="bg-background/50 border-vibe-glass-border"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employee List
          </Button>
          <h1 className="text-4xl font-dancing text-vibe-warm-brown">
            {employee.name}'s Dashboard
          </h1>
        </div>
        <h2 
          className="text-2xl font-dancing text-vibe-warm-brown cursor-pointer hover:text-vibe-glow-orange transition-colors"
          onClick={() => navigate('/admin')}
        >
          Vibe
        </h2>
      </div>

      {/* Employee Info */}
      <div className="p-6">
        <Card className="glass-modal border-vibe-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-2">
                  {employee.name}
                </h3>
                <p className="text-vibe-soft-orange mb-1">{employee.email}</p>
                <p className="text-sm text-muted-foreground">
                  Last active: {employee.lastActive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Employee Mood Distribution */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="font-dancing text-vibe-warm-brown text-2xl">
                Mood Distribution (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockEmployeeMoodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {mockEmployeeMoodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Employee Energy Levels */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="font-dancing text-vibe-warm-brown text-2xl">
                Weekly Energy Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEmployeeEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--vibe-glass-border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="energy" 
                      stroke="hsl(var(--vibe-glow-orange))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--vibe-soft-orange))', strokeWidth: 2, r: 6 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Employee Satisfaction Levels */}
          <Card className="glass-modal border-vibe-glass-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-dancing text-vibe-warm-brown text-2xl">
                Weekly Satisfaction Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockEmployeeSatisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--vibe-glass-border))" />
                    <XAxis 
                      dataKey="day" 
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="satisfaction" 
                      fill="hsl(var(--vibe-soft-orange))"
                      animationDuration={1500}
                      animationBegin={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;