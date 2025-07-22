import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



// Theme-based color interpolation function
const interpolateColor = (ratio: number): string => {
  // Use theme colors: soft orange to glow orange gradient
  const startColor = { r: 191, g: 120, b: 64 };  // vibe-soft-orange equivalent
  const endColor = { r: 242, g: 153, b: 74 };    // vibe-glow-orange equivalent
  
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getEmojiForRatio = (ratio: number): string => {
  if (ratio < 0.2) return '😭';
  if (ratio < 0.4) return '😞';
  if (ratio < 0.6) return '👍';
  if (ratio < 0.8) return '😊';
  return '🤩';
};

const SatisfactionPage = () => {
  const [satisfactionRatio, setSatisfactionRatio] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [emojis, setEmojis] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const zipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleZipDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !zipRef.current) return;

    const rect = zipRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(1, x / rect.width));
    
    if (Math.abs(newRatio - satisfactionRatio) > 0.01) { // Only update if significant change
      setSatisfactionRatio(newRatio);
      spawnEmojis(newRatio);
      // Removed zip sound effect
    }
  };

  const spawnEmojis = (ratio: number) => {
    const emoji = getEmojiForRatio(ratio);
    const count = Math.max(1, Math.floor(ratio * 2) + 1); // Reduced from * 5 to * 2

    const newEmojis = [];
    for (let i = 0; i < count; i++) {
      newEmojis.push({
        id: Date.now() + i,
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * 100 + 200,
        emoji: emoji,
      });
    }

    setEmojis(prev => [...prev, ...newEmojis]);

    // Remove emojis faster - reduced from 2000ms to 1000ms
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => !newEmojis.includes(e)));
    }, 1000);
  };

  const goToNextPage = () => {
    if (satisfactionRatio > 0) {
      // Pass the hex color and ratio to the next page
      const hexColor = interpolateColor(satisfactionRatio);
      navigate('/log', { state: { satisfactionColor: hexColor, satisfactionRatio } });
    }
  };

  const goToPrevPage = () => {
    navigate('/complexity');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen grainy-bg relative overflow-hidden page-transition">
      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <button 
          onClick={goToDashboard}
          className="text-4xl font-dancing text-vibe-warm-brown hover:text-vibe-glow-orange transition-colors cursor-pointer"
        >
          Vibe
        </button>
        <div className="flex space-x-4">
          <button
            onClick={goToDashboard}
            className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-vibe-warm-brown" />
          </button>
          <button 
            onClick={goToProfile}
            className="p-3 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors"
          >
            <User className="w-6 h-6 text-vibe-warm-brown" />
          </button>
        </div>
      </div>

      {/* Floating Emojis */}
      <AnimatePresence>
        {emojis.map((emoji) => (
          <motion.div
            key={emoji.id}
            initial={{ 
              opacity: 1, 
              scale: 0.5,
              x: emoji.x,
              y: emoji.y,
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.5,
              y: emoji.y - 150,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed z-30 text-4xl pointer-events-none"
          >
            {emoji.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-dancing text-vibe-warm-brown mb-16 text-center"
        >
          How satisfying was your day?
        </motion.h2>

        {/* Color Slider */}
        <div className="relative w-full max-w-2xl px-8">
          <div className="mb-8">
            <div className="flex justify-between text-lg font-dancing text-vibe-warm-brown mb-4">
              <span className="text-2xl">😭</span>
              <span className="text-2xl">😞</span>
              <span className="text-2xl">👍</span>
              <span className="text-2xl">😊</span>
              <span className="text-2xl">🤩</span>
            </div>
            
            <div 
              ref={zipRef}
              className="relative h-16 rounded-full cursor-pointer border-4 border-vibe-glow-orange"
              style={{
                background: `linear-gradient(to right, 
                  hsl(var(--vibe-soft-orange)) 0%, 
                  hsl(var(--vibe-glow-orange)) 100%)`
              }}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleZipDrag}
            >
              {/* Zip puller */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-8 h-12 bg-vibe-glow-orange rounded-lg cursor-grab active:cursor-grabbing shadow-lg border-2 border-vibe-warm-brown"
                style={{
                  left: `${satisfactionRatio * 100}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
                animate={{
                  scale: isDragging ? 1.1 : 1,
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent rounded-lg" />
              </motion.div>
            </div>
          </div>

          {satisfactionRatio > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-2xl font-dancing text-vibe-glow-orange mb-4">
                Satisfaction: {Math.round(satisfactionRatio * 100)}%
              </p>
              <p className="text-lg font-dancing text-vibe-warm-brown">
                {getEmojiForRatio(satisfactionRatio)} 
                {satisfactionRatio < 0.2 && " Very Unsatisfying"}
                {satisfactionRatio >= 0.2 && satisfactionRatio < 0.4 && " Somewhat Unsatisfying"}
                {satisfactionRatio >= 0.4 && satisfactionRatio < 0.6 && " Neutral"}
                {satisfactionRatio >= 0.6 && satisfactionRatio < 0.8 && " Satisfying"}
                {satisfactionRatio >= 0.8 && " Extremely Satisfying"}
              </p>
              <p className="text-sm font-dancing text-vibe-soft-orange mt-2">
                Color: {interpolateColor(satisfactionRatio)}
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xl font-dancing text-vibe-warm-brown">Drag the zip to rate your satisfaction</p>
        </div>
      </div>

      {/* Navigation Arrows - Bigger and more visible */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={goToPrevPage}
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20 p-6 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors shadow-xl"
      >
        <ChevronLeft className="w-10 h-10 text-vibe-warm-brown" />
      </motion.button>

      {satisfactionRatio > 0 && (
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goToNextPage}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 p-6 glass-modal rounded-full hover:bg-vibe-glow-orange/20 transition-colors shadow-xl"
        >
          <ChevronRight className="w-10 h-10 text-vibe-warm-brown" />
        </motion.button>
      )}
    </div>
  );
};

export default SatisfactionPage;