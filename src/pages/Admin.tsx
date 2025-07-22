import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  BarChart3, 
  User, 
  LogOut, 
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for demonstrations
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@company.com', lastActive: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', lastActive: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@company.com', lastActive: '2024-01-13' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', lastActive: '2024-01-12' },
];

const mockMoodData = [
  { date: '2024-01-01', angry: 2, sad: 3, happy: 15, good: 8, joy: 5 },
  { date: '2024-01-02', angry: 1, sad: 2, happy: 18, good: 10, joy: 2 },
  { date: '2024-01-03', angry: 0, sad: 1, happy: 20, good: 12, joy: 0 },
  { date: '2024-01-04', angry: 3, sad: 4, happy: 14, good: 9, joy: 3 },
  { date: '2024-01-05', angry: 1, sad: 2, happy: 16, good: 11, joy: 3 },
];

const generateHeatMapData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      energy: Math.floor(Math.random() * 5) + 1,
      satisfaction: Math.floor(Math.random() * 5) + 1,
    });
  }
  
  return data;
};

const AdminPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const heatMapData = generateHeatMapData();

  const getEnergyColor = (energy: number) => {
    const colors = [
      'hsl(var(--muted))',
      'hsl(var(--vibe-soft-orange) / 0.3)',
      'hsl(var(--vibe-soft-orange) / 0.5)',
      'hsl(var(--vibe-soft-orange) / 0.7)',
      'hsl(var(--vibe-glow-orange) / 0.8)',
      'hsl(var(--vibe-glow-orange))',
    ];
    return colors[energy] || colors[0];
  };

  const getMoodColor = (mood: 'angry' | 'sad' | 'happy' | 'good' | 'joy') => {
    const colors = {
      angry: '#ef4444',
      sad: '#f97316',
      happy: '#eab308',
      good: '#22c55e',
      joy: '#06b6d4',
    };
    return colors[mood];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Simulate CSV processing
      setTimeout(() => {
        const randomCount = Math.floor(Math.random() * 20) + 5;
        setUploadSuccess(`${randomCount} emails successfully added!`);
        setShowUploadModal(false);
        setTimeout(() => setUploadSuccess(null), 3000);
      }, 1000);
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="min-h-screen grainy-bg">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-vibe-glass-border">
        <h1 className="text-4xl font-dancing text-vibe-warm-brown">
          Vibe HR Dashboard
        </h1>
        <div className="flex space-x-4">
          <Button 
            onClick={() => setShowUploadModal(true)}
            className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Employees
          </Button>
          <button className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors">
            <BarChart3 className="w-6 h-6 text-vibe-warm-brown" />
          </button>
          <div className="relative group">
            <button className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors">
              <User className="w-6 h-6 text-vibe-warm-brown" />
            </button>
            <div className="absolute right-0 top-12 hidden group-hover:block">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 glass-modal rounded-lg text-vibe-warm-brown hover:bg-vibe-glow-orange/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
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
              <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-6">
                Upload Employee Emails
              </h3>
              <p className="text-vibe-warm-brown mb-6">
                Upload a CSV file with employee email addresses. Each email will receive an invite link.
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

      {/* Main Content */}
      <div className="p-6 space-y-8">
        
        {/* Month Selector */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <button 
            onClick={() => changeMonth('prev')}
            className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-vibe-warm-brown" />
          </button>
          <h2 className="text-2xl font-dancing text-vibe-warm-brown">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button 
            onClick={() => changeMonth('next')}
            className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-vibe-warm-brown" />
          </button>
        </div>

        {/* Mood Distribution Chart */}
        <Card className="glass-modal border-vibe-glass-border">
          <CardHeader>
            <CardTitle className="font-dancing text-vibe-warm-brown">
              Daily Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMoodData.map((day, index) => {
                const total = day.angry + day.sad + day.happy + day.good + day.joy;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm font-dancing text-vibe-warm-brown">
                      <span>{new Date(day.date).toLocaleDateString()}</span>
                      <span>{total} employees</span>
                    </div>
                    <div className="flex h-8 rounded-lg overflow-hidden">
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${(day.angry / total) * 100}%` }}
                        title={`Angry: ${day.angry}`}
                      />
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${(day.sad / total) * 100}%` }}
                        title={`Sad: ${day.sad}`}
                      />
                      <div 
                        className="bg-yellow-500" 
                        style={{ width: `${(day.happy / total) * 100}%` }}
                        title={`Happy: ${day.happy}`}
                      />
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${(day.good / total) * 100}%` }}
                        title={`Good: ${day.good}`}
                      />
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${(day.joy / total) * 100}%` }}
                        title={`Joy: ${day.joy}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Energy Heatmap */}
        <Card className="glass-modal border-vibe-glass-border">
          <CardHeader>
            <CardTitle className="font-dancing text-vibe-warm-brown">
              Energy Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {heatMapData.slice(0, 84).map((day, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-sm cursor-pointer transition-all hover:scale-110"
                  style={{ backgroundColor: getEnergyColor(day.energy) }}
                  title={`${day.date}: Energy ${day.energy}, Satisfaction ${day.satisfaction}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm font-dancing text-vibe-warm-brown">
              <span>Less</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: getEnergyColor(level) }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Satisfaction vs Complexity */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="font-dancing text-vibe-warm-brown">
                Satisfaction vs Complexity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <svg width="300" height="200" className="text-vibe-soft-orange">
                  <path
                    d="M 20 180 Q 80 120 140 100 T 280 60"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-lg"
                  />
                  {[20, 80, 140, 200, 280].map((x, i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={180 - (i * 25 + Math.random() * 30)}
                      r="4"
                      fill="hsl(var(--vibe-glow-orange))"
                      className="drop-shadow-md"
                    />
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Satisfaction vs Energy */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="font-dancing text-vibe-warm-brown">
                Satisfaction vs Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <svg width="300" height="200" className="text-vibe-glow-orange">
                  <path
                    d="M 20 160 Q 80 100 140 80 T 280 40"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-lg"
                  />
                  {[20, 80, 140, 200, 280].map((x, i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={160 - (i * 20 + Math.random() * 40)}
                      r="4"
                      fill="hsl(var(--vibe-soft-orange))"
                      className="drop-shadow-md"
                    />
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee List */}
        <Card className="glass-modal border-vibe-glass-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-dancing text-vibe-warm-brown">
              Employees
            </CardTitle>
            <Button
              className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 glass-modal rounded-lg border border-vibe-glass-border cursor-pointer"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-dancing text-vibe-warm-brown font-medium">
                        {employee.name}
                      </h4>
                      <p className="text-sm text-vibe-soft-orange">
                        {employee.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {employee.lastActive}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-vibe-glow-orange" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
                <h3 className="text-2xl font-dancing text-vibe-warm-brown">
                  {selectedEmployee.name}'s Dashboard
                </h3>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 glass-modal rounded-full hover:bg-vibe-glow-orange/20"
                >
                  ✕
                </button>
              </div>
              
              {/* Individual Employee Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Mood Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center">
                      <div className="text-vibe-soft-orange">📊 Individual mood chart</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Energy Levels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center">
                      <div className="text-vibe-glow-orange">⚡ Individual energy chart</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Task Complexity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center">
                      <div className="text-vibe-soft-orange">🎯 Individual complexity chart</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-modal border-vibe-glass-border">
                  <CardHeader>
                    <CardTitle className="font-dancing text-vibe-warm-brown">
                      Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center">
                      <div className="text-vibe-glow-orange">😊 Individual satisfaction chart</div>
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