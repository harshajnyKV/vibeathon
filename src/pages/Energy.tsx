import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, User } from "lucide-react";

const energyLevels = [
  { clicks: 1, value: 1, label: "Very Low", intensity: 0.2 },
  { clicks: 2, value: 2, label: "Low", intensity: 0.4 },
  { clicks: 3, value: 3, label: "Average", intensity: 0.6 },
  { clicks: 4, value: 4, label: "Good", intensity: 0.8 },
  { clicks: 5, value: 5, label: "Extremely Energetic", intensity: 1.0 },
];

const Energy = () => {
  const [clickCount, setClickCount] = useState(0);
  const [energySet, setEnergySet] = useState(false);
  const navigate = useNavigate();

  const handleSphereClick = () => {
    if (clickCount < 5) {
      setClickCount(prev => prev + 1);
    }
  };

  const handleSetEnergy = () => {
    if (clickCount > 0) {
      setEnergySet(true);
    }
  };

  const handleNext = () => {
    if (energySet) {
      navigate("/complexity");
    }
  };

  const handlePrev = () => {
    navigate("/mood");
  };

  const getCurrentLevel = () => {
    return energyLevels.find(level => level.clicks === clickCount) || energyLevels[0];
  };

  const getSphereStyle = () => {
    const level = getCurrentLevel();
    const opacity = clickCount === 0 ? 0.3 : 0.7 + (level.intensity * 0.3);
    const scale = 1 + (level.intensity * 0.3);
    const glowIntensity = level.intensity * 60;
    
    return {
      opacity,
      transform: `scale(${scale})`,
      background: `radial-gradient(circle, hsl(var(--vibe-glow-orange) / ${opacity}), hsl(var(--vibe-soft-orange) / ${opacity * 0.7}))`,
      boxShadow: clickCount > 0 ? `0 0 ${glowIntensity}px hsl(var(--vibe-glow-orange) / 0.8)` : 'none',
      filter: clickCount > 0 ? `brightness(${1 + level.intensity * 0.5})` : 'brightness(1)',
    };
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
          How energetic do you feel?
        </h2>

        {/* Energy Sphere */}
        <div className="mb-12 flex flex-col items-center">
          <div
            onClick={handleSphereClick}
            style={getSphereStyle()}
            className={`w-48 h-48 rounded-full cursor-pointer transition-all duration-500 ease-out border-4 border-vibe-soft-orange/30 ${
              clickCount > 3 ? 'energy-glow' : ''
            }`}
          />
          
          {/* Click indicator */}
          <div className="mt-8 text-center">
            <p className="text-3xl font-dancing text-vibe-warm-brown mb-2">
              {clickCount > 0 ? getCurrentLevel().label : "Click to charge your energy!"}
            </p>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div
                  key={dot}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    dot <= clickCount 
                      ? 'bg-vibe-glow-orange shadow-lg' 
                      : 'bg-vibe-soft-orange/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Set Energy Button */}
        {clickCount > 0 && (
          <Button
            onClick={handleSetEnergy}
            className={`mb-8 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
              energySet
                ? 'bg-vibe-glow-orange text-white shadow-lg'
                : 'bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white'
            }`}
          >
            {energySet ? '✓ Energy Set' : 'Set Energy'}
          </Button>
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

        {energySet && (
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

export default Energy;