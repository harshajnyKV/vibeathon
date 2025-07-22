import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { format } from "date-fns";
import { generateReportPDF } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstrations
const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@company.com",
    lastActive: "2024-01-15",
    password: "temp123",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@company.com",
    lastActive: "2024-01-14",
    password: "temp123",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@company.com",
    lastActive: "2024-01-13",
    password: "temp123",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@company.com",
    lastActive: "2024-01-12",
    password: "temp123",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily@company.com",
    lastActive: "2024-01-11",
    password: "temp123",
  },
  {
    id: 6,
    name: "David Brown",
    email: "david@company.com",
    lastActive: "2024-01-10",
    password: "temp123",
  },
];

// Function to generate mood data based on selected date
const generateMoodData = (selectedDate: Date) => {
  // Use date as seed for consistent but varying data
  const dateString = selectedDate.toISOString().split("T")[0];
  const seed = dateString
    .split("-")
    .reduce((acc, val) => acc + parseInt(val), 0);

  // Create a simple seeded random function
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  const baseValues = [
    { name: "Angry", color: "#ef4444", baseValue: 8 },
    { name: "Sad", color: "#f97316", baseValue: 12 },
    { name: "Happy", color: "#eab308", baseValue: 40 },
    { name: "Good", color: "#22c55e", baseValue: 30 },
    { name: "Joy", color: "#06b6d4", baseValue: 10 },
  ];

  return baseValues.map((mood, index) => ({
    ...mood,
    value: Math.max(
      1,
      Math.round(mood.baseValue + (seededRandom(index) - 0.5) * 20)
    ),
  }));
};

// Function to generate week data based on selected date
const generateWeekData = (
  selectedDate: Date,
  dataType: "energy" | "satisfaction"
) => {
  const startOfWeek = new Date(selectedDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
  startOfWeek.setDate(diff);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Use date as seed for consistent but varying data
  const dateString = selectedDate.toISOString().split('T')[0];
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index + (dataType === "energy" ? 100 : 200)) * 10000;
    return x - Math.floor(x);
  };

  const baseEnergyRange = { min: 2.5, max: 4.8 };
  const baseSatisfactionRange = { min: 3.0, max: 4.7 };

  return weekDays.map((dayName, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);
    const formattedDate = format(currentDate, "MMM dd");

    let value;
    if (dataType === "energy") {
      value = baseEnergyRange.min + seededRandom(index) * (baseEnergyRange.max - baseEnergyRange.min);
    } else {
      value = baseSatisfactionRange.min + seededRandom(index) * (baseSatisfactionRange.max - baseSatisfactionRange.min);
    }

    return {
      day: `${dayName} (${formattedDate})`,
      [dataType]: Math.round(value * 10) / 10, // Round to 1 decimal place
    };
  });
};

// Function to generate task complexity data based on selected date
const generateTaskComplexityData = (selectedDate: Date) => {
  const dateString = selectedDate.toISOString().split('T')[0];
  const seed = dateString.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  
  const seededRandom = (index: number) => {
    const x = Math.sin(seed + index + 300) * 10000;
    return x - Math.floor(x);
  };

  const baseComplexity = [
    { name: "Easy", baseCount: 40 },
    { name: "Medium", baseCount: 30 },
    { name: "Hard", baseCount: 20 },
    { name: "Super Hard", baseCount: 10 },
  ];

  return baseComplexity.map((complexity, index) => ({
    ...complexity,
    count: Math.max(1, Math.round(complexity.baseCount + (seededRandom(index) - 0.5) * 20)),
  }));
};

const AdminPage = () => {
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof mockEmployees)[0] | null
  >(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [selectedMoodDate, setSelectedMoodDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedEnergyDate, setSelectedEnergyDate] = useState<
    Date | undefined
  >(new Date());
  const [selectedComplexityDate, setSelectedComplexityDate] = useState<
    Date | undefined
  >(new Date());
  const [selectedSatisfactionDate, setSelectedSatisfactionDate] = useState<
    Date | undefined
  >(new Date());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate dynamic data based on selected dates
  const moodData = generateMoodData(selectedMoodDate || new Date());
  const energyData = generateWeekData(
    selectedEnergyDate || new Date(),
    "energy"
  );
  const satisfactionData = generateWeekData(
    selectedSatisfactionDate || new Date(),
    "satisfaction"
  );
  const taskComplexityData = generateTaskComplexityData(selectedComplexityDate || new Date());

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
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
    navigate("/");
  };

  const handleVibeClick = () => {
    navigate("/admin");
  };

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your report.",
        variant: "default",
      });

      await generateReportPDF("Monthly Admin Report");

      toast({
        title: "Success!",
        description: "Your PDF report has been downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
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
            onClick={() => navigate("/employee-list")}
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
      <div id="main-content" className="p-6 space-y-8">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Pie Chart */}
          <Card className="glass-modal border-vibe-glass-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-dancing text-vibe-warm-brown text-2xl">
                  Mood Distribution -{" "}
                  {selectedMoodDate
                    ? format(selectedMoodDate, "MMM dd, yyyy")
                    : "Today"}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-background/50 border-vibe-glass-border"
                    >
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
                      data={moodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {moodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Color Legend */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {moodData.map((entry) => (
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
                  Energy Levels - Week of{" "}
                  {selectedEnergyDate
                    ? format(selectedEnergyDate, "MMM dd, yyyy")
                    : "Today"}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-background/50 border-vibe-glass-border"
                    >
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--vibe-glass-border))"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--vibe-warm-brown))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="energy"
                      stroke="hsl(var(--vibe-glow-orange))"
                      strokeWidth={3}
                      dot={{
                        fill: "hsl(var(--vibe-soft-orange))",
                        strokeWidth: 2,
                        r: 6,
                      }}
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
                  Task Complexity -{" "}
                  {selectedComplexityDate
                    ? format(selectedComplexityDate, "MMM dd, yyyy")
                    : "Today"}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-background/50 border-vibe-glass-border"
                    >
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
                {taskComplexityData.map((task, index) => (
                  <motion.div
                    key={task.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="text-center p-4 glass-modal rounded-lg border border-vibe-glass-border cursor-pointer hover:border-vibe-glow-orange/50 transition-all"
                    onClick={() =>
                      navigate(
                        `/complexity-employees/${task.name
                          .toLowerCase()
                          .replace(" ", "-")}`
                      )
                    }
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
                  Satisfaction Levels - Week of{" "}
                  {selectedSatisfactionDate
                    ? format(selectedSatisfactionDate, "MMM dd, yyyy")
                    : "Today"}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-background/50 border-vibe-glass-border"
                    >
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--vibe-glass-border))"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--vibe-warm-brown))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--vibe-warm-brown))" fontSize={12} />
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
          <Button
            onClick={handleExportPDF}
            className="bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white text-lg px-8 py-3"
          >
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
                        <span className="font-dancing text-vibe-warm-brown">
                          This Week
                        </span>
                        <span className="font-dancing text-vibe-glow-orange">
                          12 tasks
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dancing text-vibe-warm-brown">
                          Satisfaction
                        </span>
                        <span className="font-dancing text-vibe-glow-orange">
                          4.2/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-dancing text-vibe-warm-brown">
                          Energy Level
                        </span>
                        <span className="font-dancing text-vibe-glow-orange">
                          3.8/5
                        </span>
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
