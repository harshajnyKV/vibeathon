import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

// Mock data - in real app this would come from API
const moodData = [
  { date: '1', mood: 3, day: 'Mon' },
  { date: '2', mood: 4, day: 'Tue' },
  { date: '3', mood: 2, day: 'Wed' },
  { date: '4', mood: 5, day: 'Thu' },
  { date: '5', mood: 3, day: 'Fri' },
  { date: '6', mood: 4, day: 'Sat' },
  { date: '7', mood: 5, day: 'Sun' },
];

const complexitySatisfactionData = [
  { complexity: 1, satisfaction: 4 },
  { complexity: 2, satisfaction: 3 },
  { complexity: 3, satisfaction: 2 },
  { complexity: 4, satisfaction: 1 },
  { complexity: 2, satisfaction: 5 },
  { complexity: 3, satisfaction: 3 },
];

const energySatisfactionData = [
  { energy: 1, satisfaction: 2 },
  { energy: 2, satisfaction: 3 },
  { energy: 3, satisfaction: 4 },
  { energy: 4, satisfaction: 4 },
  { energy: 5, satisfaction: 5 },
  { energy: 3, satisfaction: 3 },
];

// Mock heatmap data
const heatmapData = Array.from({ length: 35 }, (_, i) => ({
  day: i + 1,
  energy: Math.floor(Math.random() * 5) + 1,
  log: `Day ${i + 1}: Sample log entry describing the day's activities and feelings.`,
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState("January 2024");

  const getMoodColor = (mood: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    return colors[mood - 1] || '#6b7280';
  };

  const getEnergyOpacity = (energy: number) => {
    return 0.2 + (energy / 5) * 0.8;
  };

  return (
    <div className="min-h-screen grainy-bg relative overflow-hidden page-transition">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/mood")}
            variant="ghost"
            size="icon"
            className="text-vibe-warm-brown hover:text-vibe-glow-orange"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-dancing text-vibe-warm-brown">Vibe Dashboard</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-vibe-warm-brown">
          <User className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Mood Chart */}
          <div className="glass-modal rounded-xl p-6 border border-vibe-soft-orange/30">
            <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-6">
              Mood Tracker - {currentMonth}
            </h3>
            <div className="grid grid-cols-7 gap-2 h-64">
              {moodData.map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 rounded-t"
                    style={{ 
                      height: `${(entry.mood / 5) * 100}%`,
                      backgroundColor: getMoodColor(entry.mood),
                      minHeight: '20px'
                    }}
                  />
                  <span className="text-sm mt-2 font-dancing text-vibe-warm-brown">{entry.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Energy Heatmap */}
            <div className="glass-modal rounded-xl p-6 border border-vibe-soft-orange/30">
              <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-6">
                Energy Heatmap
              </h3>
              <div>
                <div className="grid grid-cols-7 gap-1">
                  {heatmapData.map((day, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-sm cursor-pointer border border-vibe-soft-orange/20 hover:border-vibe-soft-orange transition-all duration-200 relative group"
                      style={{
                        backgroundColor: `hsl(var(--vibe-glow-orange) / ${getEnergyOpacity(day.energy)})`,
                      }}
                      title={day.log}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-vibe-warm-brown">
                        {day.day}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-vibe-warm-brown text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 max-w-48">
                        {day.log}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Complexity vs Satisfaction */}
            <div className="glass-modal rounded-xl p-6 border border-vibe-soft-orange/30">
              <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-6">
                Complexity vs Satisfaction
              </h3>
              <div className="h-48 flex items-end justify-around">
                {complexitySatisfactionData.map((entry, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-6 bg-vibe-glow-orange rounded-t"
                      style={{ height: `${(entry.satisfaction / 5) * 150}px` }}
                    />
                    <span className="text-xs mt-2 font-dancing">C{entry.complexity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Energy vs Satisfaction */}
          <div className="glass-modal rounded-xl p-6 border border-vibe-soft-orange/30">
            <h3 className="text-2xl font-dancing text-vibe-warm-brown mb-6">
              Energy vs Satisfaction
            </h3>
            <div className="h-64 flex items-end justify-around">
              {energySatisfactionData.map((entry, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-6 bg-vibe-soft-orange rounded-t"
                    style={{ height: `${(entry.satisfaction / 5) * 180}px` }}
                  />
                  <span className="text-xs mt-2 font-dancing">E{entry.energy}</span>
                </div>
              ))}
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;