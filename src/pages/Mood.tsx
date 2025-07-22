import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";

const moodEmojis = [
  { emoji: "😡", label: "Angry", value: 1 },
  { emoji: "😢", label: "Sad", value: 2 },
  { emoji: "😊", label: "Happy", value: 3 },
  { emoji: "😌", label: "Good", value: 4 },
  { emoji: "😄", label: "Joy", value: 5 },
];

const Mood = () => {
  const [currentMood, setCurrentMood] = useState(0);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const navigate = useNavigate();

  const nextMood = () => {
    setCurrentMood((prev) => (prev + 1) % moodEmojis.length);
  };

  const prevMood = () => {
    setCurrentMood((prev) => (prev - 1 + moodEmojis.length) % moodEmojis.length);
  };

  const handleSetMood = () => {
    setSelectedMood(currentMood);
  };

  const handleNext = () => {
    if (selectedMood !== null) {
      navigate("/energy");
    }
  };

  return (
    <div className="min-h-screen grainy-bg relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-dancing text-vibe-warm-brown">Vibe</h1>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="text-vibe-warm-brown">
            <BarChart3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-vibe-warm-brown">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown text-center mb-20">
          What is your mood today?
        </h2>

        {/* Mood Semicircle */}
        <div className="relative w-full max-w-2xl h-64 mb-12">
          {/* Semicircle background */}
          <div className="absolute bottom-0 left-0 right-0 h-32 border-4 border-vibe-soft-orange rounded-t-full flex items-end justify-center">
            {/* Current emoji in center */}
            <div className="absolute -top-8 text-8xl animate-bounce">
              {moodEmojis[currentMood].emoji}
            </div>
          </div>

          {/* Navigation arrows */}
          <Button
            onClick={prevMood}
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            onClick={nextMood}
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Mood label */}
        <p className="text-2xl font-dancing text-vibe-warm-brown mb-8">
          {moodEmojis[currentMood].label}
        </p>

        {/* Set Mood Button */}
        <Button
          onClick={handleSetMood}
          className={`mb-8 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedMood === currentMood
              ? 'bg-vibe-glow-orange text-white shadow-lg'
              : 'bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white'
          }`}
        >
          {selectedMood === currentMood ? '✓ Mood Set' : 'Set Mood'}
        </Button>

        {/* Navigation Arrow */}
        {selectedMood !== null && (
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange animate-pulse"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Mood;