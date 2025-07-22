import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";
import UserSettings from "@/components/UserSettings";

const complexityLevels = [
  { id: 1, label: "Easy", value: 1, color: "bg-green-400" },
  { id: 2, label: "Medium", value: 2, color: "bg-yellow-400" },
  { id: 3, label: "Hard", value: 3, color: "bg-orange-400" },
  { id: 4, label: "Super Hard", value: 4, color: "bg-red-400" },
];

const Complexity = () => {
  const [selectedComplexity, setSelectedComplexity] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleComplexitySelect = (id: number) => {
    setSelectedComplexity(id);
  };

  const handleNext = () => {
    if (selectedComplexity !== null) {
      navigate("/satisfaction");
    }
  };

  const handlePrev = () => {
    navigate("/energy");
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
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-3 glass-modal rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-vibe-warm-brown" />
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

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown text-center mb-20">
          How complex were your tasks?
        </h2>

        {/* Complexity Buttons */}
        <div className="grid grid-cols-2 gap-6 mb-12 max-w-md w-full">
          {complexityLevels.map((level) => (
            <Button
              key={level.id}
              onClick={() => handleComplexitySelect(level.id)}
              variant="outline"
              className={`h-20 text-xl font-medium rounded-xl border-2 transition-all duration-300 ${
                selectedComplexity === level.id
                  ? 'bg-vibe-glow-orange border-vibe-glow-orange text-white shadow-lg transform scale-105'
                  : 'bg-background/70 border-vibe-soft-orange/50 text-vibe-warm-brown hover:bg-vibe-soft-orange/20 hover:border-vibe-soft-orange'
              }`}
            >
              {level.label}
            </Button>
          ))}
        </div>

        {/* Selection Indicator */}
        {selectedComplexity !== null && (
          <div className="text-center mb-8">
            <p className="text-2xl font-dancing text-vibe-warm-brown">
              ✓ Selected: {complexityLevels.find(l => l.id === selectedComplexity)?.label}
            </p>
          </div>
        )}

        {/* Navigation Arrows - bigger and more visible */}
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="icon"
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange w-16 h-16 rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-soft-orange/30"
        >
          <ChevronLeft className="h-12 w-12" />
        </Button>

        {selectedComplexity !== null && (
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
        onProfileImageChange={setProfileImageUrl}
      />
    </div>
  );
};

export default Complexity;