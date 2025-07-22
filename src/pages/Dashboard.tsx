import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { generateReportPDF } from "@/lib/pdfUtils";
import { useToast } from "@/hooks/use-toast";
import UserSettings from "@/components/UserSettings";

// Mock data - in real app this would come from API/context
const moodData = [
  { date: "01", mood: 3, day: "Mon" },
  { date: "02", mood: 4, day: "Tue" },
  { date: "03", mood: 2, day: "Wed" },
  { date: "04", mood: 5, day: "Thu" },
  { date: "05", mood: 3, day: "Fri" },
  { date: "06", mood: 4, day: "Sat" },
  { date: "07", mood: 4, day: "Sun" },
];

const complexitySatisfactionData = [
  { complexity: 1, satisfaction: 4 },
  { complexity: 2, satisfaction: 3 },
  { complexity: 3, satisfaction: 2 },
  { complexity: 4, satisfaction: 1 },
];

const energySatisfactionData = [
  { energy: 1, satisfaction: 2 },
  { energy: 2, satisfaction: 3 },
  { energy: 3, satisfaction: 4 },
  { energy: 4, satisfaction: 4 },
  { energy: 5, satisfaction: 5 },
];

// Generate heat map data for the entire year
const generateYearHeatMapData = () => {
  const data = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Sample log entries for variety
  const sampleLogs = [
    "Had a productive morning meeting with the team. Feeling energized!",
    "Completed the quarterly report. Satisfied with the progress.",
    "Challenging day with multiple deadlines but managed well.",
    "Great team collaboration on the new project. High energy!",
    "Focused coding session. Made significant progress on features.",
    "Attended training workshop. Learned new techniques.",
    "Slow start but picked up momentum by afternoon.",
    "Excellent presentation today. Client was very impressed.",
    "Working from home was peaceful and productive.",
    "Tough debugging session but finally solved the issue.",
    "Team lunch and brainstorming session was inspiring.",
    "Handled customer support efficiently. Good problem-solving.",
    "Research and planning for next sprint. Strategic thinking.",
    "Code review session with junior developers. Mentoring day.",
    "Successfully deployed new features. No issues!",
    "Creativity flowing well during design session.",
    "Efficient day with good time management.",
    "Collaborative work with designers on UI improvements.",
    "Data analysis revealed interesting insights.",
    "End-of-week retrospective. Planning improvements.",
  ];

  // Generate data for all 12 months
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month, day);
      const isPastDate =
        month < currentMonth || (month === currentMonth && day <= currentDay);

      // Generate realistic log entry for past dates
      const energy = isPastDate ? Math.floor(Math.random() * 5) + 1 : 0;
      const logEntry = isPastDate
        ? sampleLogs[Math.floor(Math.random() * sampleLogs.length)]
        : "";

      data.push({
        date: date.toISOString().split("T")[0],
        month: date.toLocaleString("default", { month: "short" }),
        day: day,
        energy: energy,
        log: logEntry,
        isPastDate,
        formattedDate: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
  }
  return data;
};

const yearHeatMapData = generateYearHeatMapData();

const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [currentMonthGroup, setCurrentMonthGroup] = useState(0);

  const goBack = () => {
    navigate("/mood");
  };

  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthsPerGroup = 5;
  const totalGroups = Math.ceil(allMonths.length / monthsPerGroup);

  const getCurrentMonths = () => {
    const startIndex = currentMonthGroup * monthsPerGroup;
    return allMonths.slice(startIndex, startIndex + monthsPerGroup);
  };

  const navigateMonthGroup = (direction: "prev" | "next") => {
    if (direction === "prev" && currentMonthGroup > 0) {
      setCurrentMonthGroup(currentMonthGroup - 1);
    } else if (direction === "next" && currentMonthGroup < totalGroups - 1) {
      setCurrentMonthGroup(currentMonthGroup + 1);
    }
  };

  const getMoodColor = (mood: number) => {
    // Using theme colors
    switch (mood) {
      case 1:
        return "hsl(0 65% 55%)"; // red for angry
      case 2:
        return "hsl(15 80% 60%)"; // orange for sad
      case 3:
        return "hsl(var(--vibe-warm-brown))"; // brown for neutral
      case 4:
        return "hsl(var(--vibe-soft-orange))"; // soft orange for good
      case 5:
        return "hsl(var(--vibe-glow-orange))"; // bright orange for joy
      default:
        return "hsl(var(--vibe-warm-brown))";
    }
  };

  const getEnergyColor = (energy: number) => {
    const intensity = energy / 5;
    return `hsl(var(--vibe-soft-orange) / ${intensity})`;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
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

  const complexityLabels = ["Easy", "Medium", "Hard", "Super Hard"];
  const energyLabels = ["Very Low", "Low", "Average", "Good", "Max"];

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we prepare your dashboard report.",
        variant: "default",
      });

      await generateReportPDF("Dashboard Report");

      toast({
        title: "Success!",
        description: "Your dashboard PDF has been downloaded successfully.",
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

  return (
    <div className="min-h-screen grainy-bg relative p-6">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={goBack}
            className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-vibe-warm-brown" />
          </button>
          <h1 className="text-4xl font-dancing font-bold text-vibe-warm-brown">
            Dashboard
          </h1>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExportPDF}
            className="p-3 glass-modal rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-glow-orange/30 transition-colors"
            title="Export Dashboard as PDF"
          >
            <Download className="w-6 h-6 text-vibe-warm-brown" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors relative overflow-hidden"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-vibe-warm-brown" />
            )}
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div
        id="main-content"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10"
      >
        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-modal border-vibe-glass-border rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-dancing font-bold text-vibe-warm-brown">
              Mood Chart
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth("prev")}
                className="p-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeMonth("next")}
                className="p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-around items-end h-64 border-b border-vibe-glass-border">
            {moodData.map((day, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="w-8 rounded-t transition-all duration-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.mood / 5) * 200}px` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  style={{
                    backgroundColor: getMoodColor(day.mood),
                  }}
                />
                <span className="text-sm text-vibe-warm-brown">{day.day}</span>
                <span className="text-xs text-vibe-warm-brown/70">
                  {day.date}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Energy Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-modal border-vibe-glass-border rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-dancing font-bold text-vibe-warm-brown">
              Energy Map
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonthGroup("prev")}
                disabled={currentMonthGroup === 0}
                className="p-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {getCurrentMonths()[0]} -{" "}
                {getCurrentMonths()[getCurrentMonths().length - 1]}{" "}
                {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonthGroup("next")}
                disabled={currentMonthGroup === totalGroups - 1}
                className="p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="h-80 overflow-auto mb-4 p-4">
            {/* Heatmap with Headers */}
            <div className="flex gap-4">
              {getCurrentMonths().map((monthName, monthIndex) => (
                <div key={monthName} className="flex flex-col">
                  {/* Month Header */}
                  <div className="text-sm text-vibe-warm-brown/70 font-medium text-center mb-3">
                    {monthName}
                  </div>

                  {/* Month Grid */}
                  <div
                    className="grid grid-cols-7 gap-1"
                    style={{ gridGap: "2px" }}
                  >
                    {yearHeatMapData
                      .filter((day) => day.month === monthName)
                      .map((day, dayIndex) => (
                        <motion.div
                          key={`${monthName}-${dayIndex}`}
                          className="w-5 h-5 cursor-pointer hover:outline hover:outline-2 hover:outline-vibe-soft-orange relative group"
                          style={{
                            backgroundColor: day.isPastDate
                              ? getEnergyColor(day.energy)
                              : "#e5e5e5",
                            borderRadius: "3px",
                            opacity: day.isPastDate ? 1 : 0.4,
                          }}
                          title={
                            day.isPastDate
                              ? `${day.formattedDate}\nEnergy: ${day.energy}/5\n\n"${day.log}"`
                              : `${day.formattedDate}\nNo data yet - future date`
                          }
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: day.isPastDate ? 1 : 0.4,
                          }}
                          transition={{
                            delay: dayIndex * 0.005,
                            duration: 0.3,
                            type: "spring",
                            stiffness: 400,
                          }}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-vibe-warm-brown/70">
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
        </motion.div>

        {/* Complexity vs Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-modal border-vibe-glass-border rounded-2xl p-6"
        >
          <h3 className="text-2xl font-dancing font-bold text-vibe-warm-brown mb-4">
            Complexity vs Satisfaction
          </h3>

          <div className="relative h-64">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map((y) => (
                <line
                  key={y}
                  x1="60"
                  y1={220 - y * 40}
                  x2="90%"
                  y2={220 - y * 40}
                  stroke="hsl(var(--vibe-glass-border))"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Animated Line chart */}
              <motion.polyline
                fill="none"
                stroke="hsl(var(--vibe-glow-orange))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={complexitySatisfactionData
                  .map((d, i) => `${80 + i * 60},${220 - d.satisfaction * 40}`)
                  .join(" ")}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />

              {/* Data points */}
              {complexitySatisfactionData.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={80 + i * 60}
                  cy={220 - d.satisfaction * 40}
                  r="6"
                  fill="hsl(var(--vibe-soft-orange))"
                  className="transition-all cursor-pointer hover:opacity-80"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                />
              ))}

              {/* Y-axis labels */}
              <text
                x="30"
                y="30"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                5
              </text>
              <text
                x="30"
                y="70"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                4
              </text>
              <text
                x="30"
                y="110"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                3
              </text>
              <text
                x="30"
                y="150"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                2
              </text>
              <text
                x="30"
                y="190"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                1
              </text>
            </svg>

            <div className="flex justify-between mt-2 px-16 text-sm text-vibe-warm-brown/70">
              {complexityLabels.map((label, index) => (
                <span key={index} className="text-center">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Energy vs Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-modal border-vibe-glass-border rounded-2xl p-6"
        >
          <h3 className="text-2xl font-dancing font-bold text-vibe-warm-brown mb-4">
            Energy vs Satisfaction
          </h3>

          <div className="relative h-64">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map((y) => (
                <line
                  key={y}
                  x1="60"
                  y1={220 - y * 40}
                  x2="90%"
                  y2={220 - y * 40}
                  stroke="hsl(var(--vibe-glass-border))"
                  strokeDasharray="2,2"
                />
              ))}

              {/* Animated Line chart */}
              <motion.polyline
                fill="none"
                stroke="hsl(var(--vibe-soft-orange))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={energySatisfactionData
                  .map((d, i) => `${80 + i * 50},${220 - d.satisfaction * 40}`)
                  .join(" ")}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
              />

              {/* Data points */}
              {energySatisfactionData.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={80 + i * 50}
                  cy={220 - d.satisfaction * 40}
                  r="6"
                  fill="hsl(var(--vibe-glow-orange))"
                  className="transition-all cursor-pointer hover:opacity-80"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
                />
              ))}

              {/* Y-axis labels */}
              <text
                x="30"
                y="30"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                5
              </text>
              <text
                x="30"
                y="70"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                4
              </text>
              <text
                x="30"
                y="110"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                3
              </text>
              <text
                x="30"
                y="150"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                2
              </text>
              <text
                x="30"
                y="190"
                className="text-sm"
                fill="hsl(var(--vibe-warm-brown))"
              >
                1
              </text>
            </svg>

            <div className="flex justify-between mt-2 px-16 text-sm text-vibe-warm-brown/70">
              {energyLabels.map((label, index) => (
                <span key={index} className="text-center">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* User Settings Modal */}
      <UserSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onProfileImageChange={setProfileImageUrl}
      />
    </div>
  );
};

export default DashboardPage;
