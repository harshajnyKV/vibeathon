import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";
import UserSettings from "@/components/UserSettings";


const moodEmojis = [
  { emoji: "😡", label: "Angry", value: 1 },
  { emoji: "😢", label: "Sad", value: 2 },
  { emoji: "😊", label: "Happy", value: 3 },
  { emoji: "😌", label: "Good", value: 4 },
  { emoji: "😄", label: "Joy", value: 5 },
];

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      console.log("Selected mood: ", selectedMood)
  },[])

  const handleSetMood = (index: number) => {
    setSelectedMood(index);
  };

  const handleNext = () => {
    if (selectedMood !== null) {
      navigate("/energy");
    }
  };

  return (
    <div className="min-h-screen grainy-bg relative overflow-hidden page-transition">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <h1 
          className="text-3xl font-dancing text-vibe-warm-brown cursor-pointer hover:text-vibe-glow-orange transition-colors"
          onClick={() => navigate("/dashboard")}
        >
          Vibe
        </h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="ghost" 
            size="icon" 
            className="text-vibe-warm-brown hover:text-vibe-glow-orange"
          >
            <BarChart3 className="h-6 w-6" />
          </Button>
          <Button 
            onClick={() => setShowSettings(true)}
            variant="ghost" 
            size="icon" 
            className="text-vibe-warm-brown hover:text-vibe-glow-orange"
          >
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown text-center mb-20">
          What is your mood today?
        </h2>

        {/* Simple Emoji Selection */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {moodEmojis.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleSetMood(index)}
              className={`text-6xl p-4 rounded-full transition-all duration-300 hover:scale-110 ${
                selectedMood === index
                  ? 'bg-vibe-glow-orange/30 scale-110 shadow-lg'
                  : 'hover:bg-vibe-soft-orange/20'
              }`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {/* Selected Mood Label */}
        {selectedMood !== null && (
          <p className="text-2xl font-dancing text-vibe-warm-brown mb-8">
            {moodEmojis[selectedMood].label}
          </p>
        )}

        {/* Navigation Arrow - bigger and more visible */}
        {selectedMood !== null && (
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange animate-pulse w-16 h-16 rounded-full bg-vibe-glow-orange/20"
          >
            <ChevronRight className="h-12 w-12" />
          </Button>
        )}
      </div>

      {/* User Settings Modal */}
      <UserSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default Mood;