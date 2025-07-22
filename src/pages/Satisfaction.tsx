import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart3, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const satisfactionEmojis = [
  { level: 1, emoji: '😭', count: 1 },
  { level: 2, emoji: '😞', count: 2 },
  { level: 3, emoji: '👍', count: 3 },
  { level: 4, emoji: '😊', count: 4 },
  { level: 5, emoji: '🤩', count: 5 },
];

const SatisfactionPage = () => {
  const [zipLevel, setZipLevel] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [emojis, setEmojis] = useState<Array<{ id: number; x: number; y: number; emoji: string; side: 'left' | 'right' }>>([]);
  const zipRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleZipDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !zipRef.current) return;

    const rect = zipRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    const level = Math.floor(progress * 5) + 1;
    
    if (level !== zipLevel && level >= 1 && level <= 5) {
      setZipLevel(level);
      spawnEmojis(level);
    }
  };

  const spawnEmojis = (level: number) => {
    const satisfactionData = satisfactionEmojis.find(s => s.level === level);
    if (!satisfactionData) return;

    const newEmojis = [];
    for (let i = 0; i < satisfactionData.count; i++) {
      // Left side emojis
      newEmojis.push({
        id: Date.now() + i * 2,
        x: Math.random() * 200 + 50,
        y: Math.random() * 100 + 200,
        emoji: satisfactionData.emoji,
        side: 'left' as const,
      });
      
      // Right side emojis
      newEmojis.push({
        id: Date.now() + i * 2 + 1,
        x: Math.random() * 200 + window.innerWidth - 250,
        y: Math.random() * 100 + 200,
        emoji: satisfactionData.emoji,
        side: 'right' as const,
      });
    }

    setEmojis(prev => [...prev, ...newEmojis]);

    // Remove emojis after animation
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => !newEmojis.includes(e)));
    }, 2000);
  };

  const goToNextPage = () => {
    if (zipLevel > 0) {
      navigate('/log');
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <h1 className="text-4xl font-cursive font-bold text-foreground">
          Vibe
        </h1>
        <div className="flex space-x-4">
          <button 
            onClick={goToDashboard}
            className="p-3 glass rounded-full hover:bg-accent/20 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-foreground" />
          </button>
          <button 
            onClick={goToProfile}
            className="p-3 glass rounded-full hover:bg-accent/20 transition-colors"
          >
            <User className="w-6 h-6 text-foreground" />
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
            transition={{ duration: 2 }}
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
          className="text-5xl md:text-6xl font-cursive font-bold text-foreground mb-16 text-center"
        >
          How satisfying was your day?
        </motion.h2>

        {/* Zip Slider */}
        <div className="relative w-full max-w-2xl px-8">
          <div className="mb-8">
            <div className="flex justify-between text-lg font-cursive text-foreground mb-4">
              {[1, 2, 3, 4, 5].map(num => (
                <span key={num} className="text-2xl font-bold">{num}</span>
              ))}
            </div>
            
            <div 
              ref={zipRef}
              className="relative h-16 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full cursor-pointer border-4 border-primary"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleZipDrag}
            >
              {/* Zip puller */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-8 h-12 bg-primary rounded-lg cursor-grab active:cursor-grabbing shadow-lg border-2 border-primary-foreground"
                style={{
                  left: `${(zipLevel / 5) * 100}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
                animate={{
                  scale: isDragging ? 1.1 : 1,
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/30 to-transparent rounded-lg" />
              </motion.div>

              {/* Zip teeth effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-background via-background to-transparent transition-all duration-300"
                  style={{
                    width: `${100 - (zipLevel / 5) * 100}%`,
                    right: 0,
                  }}
                />
              </div>
            </div>
          </div>

          {zipLevel > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-2xl font-cursive text-accent mb-4">
                Satisfaction Level: {zipLevel}/5
              </p>
              <p className="text-lg text-muted-foreground">
                {satisfactionEmojis.find(s => s.level === zipLevel)?.emoji} 
                {zipLevel === 1 && " Very Unsatisfying"}
                {zipLevel === 2 && " Somewhat Unsatisfying"}
                {zipLevel === 3 && " Neutral"}
                {zipLevel === 4 && " Satisfying"}
                {zipLevel === 5 && " Extremely Satisfying"}
              </p>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          <p className="font-cursive">Drag the zip to rate your satisfaction</p>
        </div>
      </div>

      {/* Navigation Arrows - Bigger and more visible */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={goToPrevPage}
        className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20 p-6 glass rounded-full hover:bg-accent/20 transition-colors shadow-xl"
      >
        <ChevronLeft className="w-10 h-10 text-foreground" />
      </motion.button>

      {zipLevel > 0 && (
        <motion.button
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={goToNextPage}
          className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 p-6 glass rounded-full hover:bg-accent/20 transition-colors shadow-xl"
        >
          <ChevronRight className="w-10 h-10 text-foreground" />
        </motion.button>
      )}
    </div>
  );
};

export default SatisfactionPage;