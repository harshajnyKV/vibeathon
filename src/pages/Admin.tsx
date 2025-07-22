import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Users, 
  User, 
  LogOut, 
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Settings,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';

// Mock data for demonstrations
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@company.com', lastActive: '2024-01-15', password: 'temp123' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', lastActive: '2024-01-14', password: 'temp123' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', lastActive: '2024-01-13', password: 'temp123' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', lastActive: '2024-01-12', password: 'temp123' },
];

const mockMoodData = [
  { name: 'Angry', value: 5, color: '#ef4444' },
  { name: 'Sad', value: 8, color: '#f97316' },
  { name: 'Happy', value: 45, color: '#eab308' },
  { name: 'Good', value: 32, color: '#22c55e' },
  { name: 'Joy', value: 10, color: '#06b6d4' },
];

// Function to generate week data based on selected date
const generateWeekData = (selectedDate: Date, dataType: 'energy' | 'satisfaction') => {
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
  startOfWeek.setDate(diff);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const baseEnergyValues = [3.2, 3.8, 2.9, 4.1, 3.7, 4.5, 4.2];
  const baseSatisfactionValues = [3.5, 4.1, 3.8, 4.3, 4.0, 4.2, 4.5];

  return weekDays.map((dayName, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);
    const formattedDate = format(currentDate, 'MMM dd');
    
    return {
      day: `${dayName} (${formattedDate})`,
      [dataType]: dataType === 'energy' ? baseEnergyValues[index] : baseSatisfactionValues[index]
    };
  });
};

const mockTaskComplexity = [
  { name: 'Easy', count: 45 },
  { name: 'Medium', count: 32 },
  { name: 'Hard', count: 18 },
  { name: 'Super Hard', count: 5 },
];

const AdminPage = () => {
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [selectedMoodDate, setSelectedMoodDate] = useState<Date | undefined>(new Date());
  const [selectedEnergyDate, setSelectedEnergyDate] = useState<Date | undefined>(new Date());
  const [selectedComplexityDate, setSelectedComplexityDate] = useState<Date | undefined>(new Date());
  const [selectedSatisfactionDate, setSelectedSatisfactionDate] = useState<Date | undefined>(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Generate dynamic data based on selected dates
  const energyData = generateWeekData(selectedEnergyDate || new Date(), 'energy');
  const satisfactionData = generateWeekData(selectedSatisfactionDate || new Date(), 'satisfaction');


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Simulate CSV processing
      setTimeout(() => {
        const randomCount = Math.floor(Math.random() * 20) + 5;
        setUploadSuccess(`${randomCount} employees successfully added!`);
        setShowUploadModal(false);
        setTimeout(() => setUploadSuccess(null), 3000);
      }, 1000);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleVibeClick = () => {
    navigate('/admin');
  };

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
        <h1 
          className="text-4xl font-dancing text-vibe-warm-brown cursor-pointer hover:text-vibe-glow-orange transition-colors"
          onClick={handleVibeClick}
        >
          Vibe
        </h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/employee-list')}
            className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            All Employees
          </Button>
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <div className="relative group">
            <button 
              onClick={() => setShowUserSettings(true)}
              className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
            >
              <User className="w-6 h-6 text-vibe-warm-brown" />
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {uploadSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Pie Chart */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-dancing text-vibe-warm-brown text-2xl">
                  Mood Distribution - {selectedMoodDate ? format(selectedMoodDate, 'MMM dd, yyyy') : 'Today'}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-background/50 border-vibe-glass-border">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={selectedMoodDate}
                      onSelect={setSelectedMoodDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockMoodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {mockMoodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Color Legend */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {mockMoodData.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm font-dancing text-vibe-warm-brown">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Energy Line Chart */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-dancing text-vibe-warm-brown text-2xl">
                  Energy Levels - Week of {selectedEnergyDate ? format(selectedEnergyDate, 'MMM dd, yyyy') : 'Today'}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-background/50 border-vibe-glass-border">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={selectedEnergyDate}
                      onSelect={setSelectedEnergyDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={energyData}>
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

          {/* Task Complexity Scoreboard */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-dancing text-vibe-warm-brown text-2xl">
                  Task Complexity - {selectedComplexityDate ? format(selectedComplexityDate, 'MMM dd, yyyy') : 'Today'}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-background/50 border-vibe-glass-border">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={selectedComplexityDate}
                      onSelect={setSelectedComplexityDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {mockTaskComplexity.map((task, index) => (
                  <motion.div
                    key={task.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="text-center p-4 glass-modal rounded-lg border border-vibe-glass-border cursor-pointer hover:border-vibe-glow-orange/50 transition-all"
                    onClick={() => navigate(`/complexity-employees/${task.name.toLowerCase().replace(' ', '-')}`)}
                  >
                    <div className="text-3xl font-dancing text-vibe-glow-orange mb-2">
                      {task.count}
                    </div>
                    <div className="text-lg font-dancing text-vibe-warm-brown">
                      {task.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction Bar Chart */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-dancing text-vibe-warm-brown text-2xl">
                  Satisfaction Levels - Week of {selectedSatisfactionDate ? format(selectedSatisfactionDate, 'MMM dd, yyyy') : 'Today'}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-background/50 border-vibe-glass-border">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="single"
                      selected={selectedSatisfactionDate}
                      onSelect={setSelectedSatisfactionDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={satisfactionData}>
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

        {/* Export Button */}
        <div className="flex justify-center">
          <Button className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white text-lg px-8 py-3">
            <Download className="w-5 h-5 mr-2" />
            Export Monthly Report
          </Button>
        </div>
      </div>


      {/* Employee List Modal */}
      <AnimatePresence>
        {showEmployeeList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowEmployeeList(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal p-8 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-dancing text-vibe-warm-brown">
                  All Employees
                </h3>
                <button
                  onClick={() => setShowEmployeeList(false)}
                  className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20"
                >
                  <X className="w-5 h-5 text-vibe-warm-brown" />
                </button>
              </div>
              <div className="space-y-3">
                {mockEmployees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 glass-modal rounded-lg border border-vibe-glass-border cursor-pointer"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowEmployeeList(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-dancing text-vibe-warm-brown font-medium text-lg">
                          {employee.name}
                        </h4>
                        <p className="text-vibe-soft-orange">
                          {employee.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last active: {employee.lastActive}
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-vibe-glow-orange" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal p-8 rounded-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-dancing text-vibe-warm-brown">
                  Upload Employee CSV
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20"
                >
                  <X className="w-5 h-5 text-vibe-warm-brown" />
                </button>
              </div>
              <p className="text-vibe-warm-brown mb-6">
                Upload a CSV file with columns: email, password, name
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose CSV File
                </Button>
                <Button
                  onClick={() => setShowUploadModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Settings Modal */}
      <AnimatePresence>
        {showUserSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowUserSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal p-8 rounded-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-dancing text-vibe-warm-brown">
                  User Settings
                </h3>
                <button
                  onClick={() => setShowUserSettings(false)}
                  className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20"
                >
                  <X className="w-5 h-5 text-vibe-warm-brown" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-vibe-warm-brown">
                    Change Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background/50 border-vibe-glass-border"
                  />
                </div>
                <div className="space-y-4">
                  <Button className="w-full bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-modal p-6 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-dancing text-vibe-warm-brown">
                  {selectedEmployee.name}'s Dashboard
                </h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20"
                >
                  <X className="w-6 h-6 text-vibe-warm-brown" />
                </button>
              </div>
              
              {/* Employee Dashboard Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Mood Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={energyData}>
                          <Line 
                            type="monotone" 
                            dataKey="energy" 
                            stroke="hsl(var(--vibe-glow-orange))" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Task Completion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-dancing text-vibe-warm-brown">This Week</span>
                        <span className="font-dancing text-vibe-glow-orange">12 tasks</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dancing text-vibe-warm-brown">Satisfaction</span>
                        <span className="font-dancing text-vibe-glow-orange">4.2/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dancing text-vibe-warm-brown">Energy Level</span>
                        <span className="font-dancing text-vibe-glow-orange">3.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;