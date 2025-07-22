import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart3, User } from "lucide-react";

const Log = () => {
  const [logText, setLogText] = useState("");
  const [isLogSet, setIsLogSet] = useState(false);
  const navigate = useNavigate();

  const handleSetLog = () => {
    if (logText.trim()) {
      setIsLogSet(true);
      // Here you would typically save the log data
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  const handlePrev = () => {
    navigate("/satisfaction");
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
          Describe your day
        </h2>

        {/* Log Text Area */}
        <div className="w-full max-w-2xl mb-12">
          <Textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Tell us about your day... What went well? What challenges did you face? How are you feeling?"
            className="min-h-[200px] text-lg p-6 rounded-xl border-4 border-vibe-soft-orange/50 bg-background/70 backdrop-blur-sm focus:border-vibe-soft-orange focus:ring-2 focus:ring-vibe-soft-orange/20 resize-none font-medium text-vibe-warm-brown placeholder:text-vibe-warm-brown/50"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--background) / 0.8), hsl(var(--card) / 0.9))',
              backdropFilter: 'blur(10px)',
            }}
          />
        </div>

        {/* Set Log Button */}
        {logText.trim() && (
          <Button
            onClick={handleSetLog}
            className={`mb-8 px-8 py-3 rounded-xl font-medium transition-all duration-300 text-lg ${
              isLogSet
                ? 'bg-vibe-glow-orange text-white shadow-lg scale-105'
                : 'bg-vibe-soft-orange hover:bg-vibe-glow-orange text-white hover:scale-105'
            }`}
            disabled={isLogSet}
          >
            {isLogSet ? '✓ Log Saved!' : 'Set Log'}
          </Button>
        )}

        {/* Success Message */}
        {isLogSet && (
          <div className="text-center mb-8 animate-fadeIn">
            <p className="text-2xl font-dancing text-vibe-warm-brown">
              Thank you for sharing! Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Navigation Arrow */}
        <Button
          onClick={handlePrev}
          variant="ghost"
          size="icon"
          className="absolute left-8 top-1/2 transform -translate-y-1/2 text-vibe-soft-orange hover:text-vibe-glow-orange w-16 h-16 rounded-full bg-vibe-soft-orange/20 hover:bg-vibe-soft-orange/30"
        >
          <ChevronLeft className="h-12 w-12" />
        </Button>
      </div>
    </div>
  );
};

export default Log;