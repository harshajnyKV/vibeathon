import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundPlayer } from '@/utils/sounds';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Auto-start background music when component mounts
    const startMusic = async () => {
      try {
        SoundPlayer.startBackgroundMusic();
        setIsPlaying(true);
      } catch (error) {
        console.log('Audio context needs user interaction');
      }
    };

    // Start after a short delay to ensure context is ready
    const timer = setTimeout(startMusic, 1000);
    
    return () => {
      clearTimeout(timer);
      SoundPlayer.stopBackgroundMusic();
    };
  }, []);

  const toggleMusic = async () => {
    try {
      const playing = SoundPlayer.toggleBackgroundMusic();
      setIsPlaying(playing);
    } catch (error) {
      console.log('Audio toggle failed:', error);
    }
  };

  return (
    <button
      onClick={toggleMusic}
      className="p-3 glass rounded-full hover:bg-accent/20 transition-colors"
      aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
    >
      {isPlaying ? (
        <Volume2 className="w-6 h-6 text-foreground" />
      ) : (
        <VolumeX className="w-6 h-6 text-foreground" />
      )}
    </button>
  );
};

export default BackgroundMusic;