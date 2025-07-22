import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, BarChart3, User } from "lucide-react";

const satisfactionLevels = [
  { value: 1, emoji: "😭", label: "Very Dissatisfied" },
  { value: 2, emoji: "👎", label: "Dissatisfied" },
  { value: 3, emoji: "👍", label: "Satisfied" },
  { value: 4, emoji: "😊", label: "Very Satisfied" },
  { value: 5, emoji: "🤩", label: "Extremely Satisfied" },
];

const Satisfaction = () => {
  const [zipLevel, setZipLevel] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{id: number, emoji: string, x: number, y: number}>>([]);
  const [emojiCounter, setEmojiCounter] = useState(0);
  const zipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleDrag(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleDrag(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!zipRef.current) return;
    
    const rect = zipRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    const level = Math.ceil((percentage / 100) * 5);
    
    if (level !== zipLevel && level > 0) {
      setZipLevel(level);
      
      // Create floating emojis - number based on level, both sides
      const currentLevel = satisfactionLevels[level - 1];
      if (currentLevel) {
        const numEmojis = level; // Number of emojis equals the level
        const newEmojis = [];
        
        for (let i = 0; i < numEmojis; i++) {
          // Left side emojis
          newEmojis.push({
            id: emojiCounter + i,
            emoji: currentLevel.emoji,
            x: x - 50 - (i * 30),
            y: rect.top + rect.height / 2 - (i * 10),
          });
          
          // Right side emojis
          newEmojis.push({
            id: emojiCounter + i + numEmojis,
            emoji: currentLevel.emoji,
            x: x + 50 + (i * 30),
            y: rect.top + rect.height / 2 - (i * 10),
          });
        }
        
        setFloatingEmojis(prev => [...prev, ...newEmojis]);
        setEmojiCounter(prev => prev + (numEmojis * 2));
        
        // Remove emojis after animation
        setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(emoji => !newEmojis.some(newE => newE.id === emoji.id)));
        }, 2000);
      }
    }
  };

  const handlePrev = () => {
    navigate("/complexity");
  };

  const handleComplete = () => {
    // Navigate to log page
    navigate("/log");
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && zipRef.current) {
        const rect = zipRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        const level = Math.ceil((percentage / 100) * 5);
        
        if (level !== zipLevel && level > 0) {
          setZipLevel(level);
          
          // Create floating emojis - number based on level, both sides
          const currentLevel = satisfactionLevels[level - 1];
          if (currentLevel) {
            const numEmojis = level; // Number of emojis equals the level
            const newEmojis = [];
            
            for (let i = 0; i < numEmojis; i++) {
              // Left side emojis
              newEmojis.push({
                id: emojiCounter + i,
                emoji: currentLevel.emoji,
                x: x - 50 - (i * 30),
                y: rect.top + rect.height / 2 - (i * 10),
              });
              
              // Right side emojis
              newEmojis.push({
                id: emojiCounter + i + numEmojis,
                emoji: currentLevel.emoji,
                x: x + 50 + (i * 30),
                y: rect.top + rect.height / 2 - (i * 10),
              });
            }
            
            setFloatingEmojis(prev => [...prev, ...newEmojis]);
            setEmojiCounter(prev => prev + (numEmojis * 2));
            
            // Remove emojis after animation
            setTimeout(() => {
              setFloatingEmojis(prev => prev.filter(emoji => !newEmojis.some(newE => newE.id === emoji.id)));
            }, 2000);
          }
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, zipLevel, emojiCounter]);

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

      {/* Floating Emojis */}
      {floatingEmojis.map((emoji) => (
        <div
          key={emoji.id}
          className="fixed text-4xl pointer-events-none z-20 animate-ping"
          style={{
            left: emoji.x,
            top: emoji.y - 50,
            animation: 'fadeInOut 2s ease-out forwards',
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <h2 className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown text-center mb-20">
          How satisfying was your day?
        </h2>

        {/* Zip Control */}
        <div className="w-full max-w-lg mb-12">
          <div className="relative">
            {/* Zip Track */}
            <div
              ref={zipRef}
              className="relative h-16 bg-vibe-soft-orange/30 rounded-full border-4 border-vibe-soft-orange cursor-pointer overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Zip Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-vibe-soft-orange to-vibe-glow-orange transition-all duration-300 ease-out"
                style={{ width: `${(zipLevel / 5) * 100}%` }}
              />
              
              {/* Zip Numbers */}
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className="absolute top-1/2 transform -translate-y-1/2 text-white font-bold text-lg"
                  style={{ left: `${((num - 1) / 4) * 100}%`, marginLeft: '8px' }}
                >
                  {num}
                </div>
              ))}
              
              {/* Zip Handle */}
              {zipLevel > 0 && (
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-vibe-glow-orange"
                  style={{ left: `${(zipLevel / 5) * 100}%` }}
                />
              )}
            </div>
          </div>

          {/* Satisfaction Level Display */}
          {zipLevel > 0 && (
            <div className="text-center mt-8">
              <div className="text-6xl mb-4">{satisfactionLevels[zipLevel - 1]?.emoji}</div>
              <p className="text-2xl font-dancing text-vibe-warm-brown">
                {satisfactionLevels[zipLevel - 1]?.label}
              </p>
            </div>
          )}
        </div>

        {/* Complete Button */}
        {zipLevel > 0 && (
          <Button
            onClick={handleComplete}
            className="px-8 py-3 rounded-xl font-medium bg-vibe-glow-orange hover:bg-vibe-glow-orange/90 text-white shadow-lg transition-all duration-300"
          >
            Complete Assessment
          </Button>
        )}

        {/* Navigation Arrow - bigger and more visible */}
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

export default Satisfaction;