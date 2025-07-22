import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Mock data - in real app this would come from API/context
const moodData = [
  { date: '01', mood: 3, day: 'Mon' },
  { date: '02', mood: 4, day: 'Tue' },
  { date: '03', mood: 2, day: 'Wed' },
  { date: '04', mood: 5, day: 'Thu' },
  { date: '05', mood: 3, day: 'Fri' },
  { date: '06', mood: 4, day: 'Sat' },
  { date: '07', mood: 4, day: 'Sun' },
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

// Generate heat map data for the past 6 months
const generateHeatMapData = () => {
  const data = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      displayDate: date.getDate().toString().padStart(2, '0'),
      energy: Math.floor(Math.random() * 5) + 1,
      log: `Day ${180 - i}: Had a productive day with moderate energy levels.`
    });
  }
  return data;
};

const heatMapData = generateHeatMapData();

const DashboardPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const goBack = () => {
    navigate('/mood');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const getMoodColor = (mood: number) => {
    // Using theme colors instead of fixed colors
    switch (mood) {
      case 1: return 'hsl(0 65% 55%)'; // destructive
      case 2: return 'hsl(15 80% 60%)'; // orange
      case 3: return 'hsl(45 55% 75%)'; // accent
      case 4: return 'hsl(25 45% 60%)'; // primary
      case 5: return 'hsl(25 85% 60%)'; // bright primary
      default: return 'hsl(var(--muted))';
    }
  };

  const getEnergyColor = (energy: number) => {
    const intensity = energy / 5;
    return `hsl(25 85% 60% / ${intensity})`;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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

  const complexityLabels = ['Easy', 'Medium', 'Hard', 'Super Hard'];
  const energyLabels = ['Very Low', 'Low', 'Average', 'Good', 'Max'];

  return (
    <div className="min-h-screen relative p-6">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={goBack}
            className="p-3 glass rounded-full hover:bg-accent/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-4xl font-cursive font-bold text-foreground">
            Dashboard
          </h1>
        </div>
        <div className="flex space-x-4">
          <button 
            className="p-3 glass rounded-full bg-accent/20"
          >
            <BarChart3 className="w-6 h-6 text-foreground" />
          </button>
          <button 
            onClick={goToProfile}
            className="p-3 glass rounded-full hover:bg-accent/20 transition-colors"
          >
            <User className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-cursive font-bold text-foreground">
              Mood Chart
            </h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => changeMonth('prev')}
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
                onClick={() => changeMonth('next')}
                className="p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-around items-end h-64 border-b border-border">
            {moodData.map((day, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center space-y-2"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div 
                  className="w-8 rounded-t transition-all duration-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.mood / 5) * 200}px` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  style={{ 
                    backgroundColor: getMoodColor(day.mood)
                  }}
                />
                <span className="text-sm text-muted-foreground">{day.day}</span>
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Energy Heat Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-cursive font-bold text-foreground">
              Energy Map
            </h3>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => changeMonth('prev')}
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
                onClick={() => changeMonth('next')}
                className="p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 h-48 overflow-auto mb-4">
            {heatMapData.slice(0, 49).map((day, index) => (
              <motion.div
                key={index}
                className="w-6 h-6 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary relative group"
                style={{ backgroundColor: getEnergyColor(day.energy) }}
                title={`${day.date}: ${day.log}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  opacity: 1 
                }}
                transition={{ 
                  delay: index * 0.02,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                  {day.displayDate}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(level => (
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
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-2xl font-cursive font-bold text-foreground mb-4">
            Complexity vs Satisfaction
          </h3>
          
          <div className="relative h-64">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map(y => (
                <line 
                  key={y}
                  x1="60" 
                  y1={220 - (y * 40)} 
                  x2="90%" 
                  y2={220 - (y * 40)}
                  stroke="hsl(var(--border))" 
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Animated Line chart */}
              <motion.polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={complexitySatisfactionData.map((d, i) => 
                  `${80 + (i * 60)},${220 - (d.satisfaction * 40)}`
                ).join(' ')}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              
              {/* Data points */}
              {complexitySatisfactionData.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={80 + (i * 60)}
                  cy={220 - (d.satisfaction * 40)}
                  r="6"
                  fill="hsl(var(--primary))"
                  className="hover:r-8 transition-all cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + (i * 0.1), type: "spring" }}
                />
              ))}
              
              {/* Y-axis labels */}
              <text x="30" y="30" className="text-sm fill-muted-foreground">5</text>
              <text x="30" y="70" className="text-sm fill-muted-foreground">4</text>
              <text x="30" y="110" className="text-sm fill-muted-foreground">3</text>
              <text x="30" y="150" className="text-sm fill-muted-foreground">2</text>
              <text x="30" y="190" className="text-sm fill-muted-foreground">1</text>
            </svg>
            
            <div className="flex justify-between mt-2 px-16 text-sm text-muted-foreground">
              {complexityLabels.map((label, index) => (
                <span key={index} className="text-center">{label}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Energy vs Satisfaction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-2xl font-cursive font-bold text-foreground mb-4">
            Energy vs Satisfaction
          </h3>
          
          <div className="relative h-64">
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Grid lines */}
              {[1, 2, 3, 4, 5].map(y => (
                <line 
                  key={y}
                  x1="60" 
                  y1={220 - (y * 40)} 
                  x2="90%" 
                  y2={220 - (y * 40)}
                  stroke="hsl(var(--border))" 
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Animated Line chart */}
              <motion.polyline
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={energySatisfactionData.map((d, i) => 
                  `${80 + (i * 50)},${220 - (d.satisfaction * 40)}`
                ).join(' ')}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              
              {/* Data points */}
              {energySatisfactionData.map((d, i) => (
                <motion.circle
                  key={i}
                  cx={80 + (i * 50)}
                  cy={220 - (d.satisfaction * 40)}
                  r="6"
                  fill="hsl(var(--accent))"
                  className="hover:r-8 transition-all cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + (i * 0.1), type: "spring" }}
                />
              ))}
              
              {/* Y-axis labels */}
              <text x="30" y="30" className="text-sm fill-muted-foreground">5</text>
              <text x="30" y="70" className="text-sm fill-muted-foreground">4</text>
              <text x="30" y="110" className="text-sm fill-muted-foreground">3</text>
              <text x="30" y="150" className="text-sm fill-muted-foreground">2</text>
              <text x="30" y="190" className="text-sm fill-muted-foreground">1</text>
            </svg>
            
            <div className="flex justify-between mt-2 px-16 text-sm text-muted-foreground">
              {energyLabels.map((label, index) => (
                <span key={index} className="text-center">{label}</span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;