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
    <div className="min-h-screen grainy-bg relative overflow-hidden page-transition">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-dancing text-vibe-warm-brown">Vibe</h1>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/dashboard")}
            variant="ghost" 
            size="icon" 
            className="text-vibe-warm-brown hover:text-vibe-glow-orange"
          >
            <BarChart3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-vibe-warm-brown hover:text-vibe-glow-orange">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown text-center mb-20">
          What is your mood today?
        </h2>

        {/* Mood Semicircle - covers half the page */}
        <div className="relative w-full h-96 mb-12 overflow-hidden">
          {/* Full circle container for rotation effect */}
          <div 
            className="absolute left-1/2 bottom-0 w-96 h-96 border-8 border-vibe-soft-orange rounded-full transform -translate-x-1/2 translate-y-1/2 transition-transform duration-700 ease-in-out"
            style={{ 
              transform: `translateX(-50%) translateY(50%) rotate(${currentMood * 72}deg)`,
              background: 'linear-gradient(45deg, hsl(var(--vibe-soft-orange) / 0.1), hsl(var(--vibe-glow-orange) / 0.2))'
            }}
          >
            {/* Emoji positions around the circle */}
            {moodEmojis.map((mood, index) => (
              <div
                key={index}
                className="absolute text-6xl transition-all duration-500"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${-index * 72}deg) translateY(-48px) rotate(${index * 72}deg)`,
                  opacity: index === currentMood ? 1 : 0.3,
                  scale: index === currentMood ? 1.2 : 0.8,
                }}
              >
                {mood.emoji}
              </div>
            ))}
          </div>

          {/* Navigation arrows - bigger and more visible */}
          <Button
            onClick={prevMood}
            variant="ghost"
            size="icon"
            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange w-16 h-16 rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-soft-orange/30"
          >
            <ChevronLeft className="h-12 w-12" />
          </Button>

          <Button
            onClick={nextMood}
            variant="ghost"
            size="icon"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange w-16 h-16 rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-soft-orange/30"
          >
            <ChevronRight className="h-12 w-12" />
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
    </div>
  );
};

export default Mood;