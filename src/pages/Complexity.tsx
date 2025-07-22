import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";

const complexityLevels = [
  { id: 1, label: "Easy", value: 1, color: "bg-green-400" },
  { id: 2, label: "Medium", value: 2, color: "bg-yellow-400" },
  { id: 3, label: "Hard", value: 3, color: "bg-orange-400" },
  { id: 4, label: "Super Hard", value: 4, color: "bg-red-400" },
];

const Complexity = () => {
  const [selectedComplexity, setSelectedComplexity] = useState<number | null>(null);
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

        {/* Navigation Arrows */}
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="icon"
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {selectedComplexity !== null && (
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

export default Complexity;