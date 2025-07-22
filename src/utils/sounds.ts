// Sound utility functions
export class SoundPlayer {
  private static context: AudioContext | null = null;
  private static backgroundGainNode: GainNode | null = null;
  private static isBackgroundPlaying = false;

  static getContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  // Background meditation music
  static startBackgroundMusic() {
    if (this.isBackgroundPlaying) return;
    
    const ctx = this.getContext();
    this.backgroundGainNode = ctx.createGain();
    this.backgroundGainNode.connect(ctx.destination);
    this.backgroundGainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Very soft volume
    
    this.isBackgroundPlaying = true;
    this.playMeditationLoop();
  }

  static stopBackgroundMusic() {
    if (this.backgroundGainNode) {
      this.backgroundGainNode.gain.exponentialRampToValueAtTime(0.001, this.getContext().currentTime + 0.5);
      setTimeout(() => {
        this.backgroundGainNode?.disconnect();
        this.backgroundGainNode = null;
      }, 500);
    }
    this.isBackgroundPlaying = false;
  }

  static toggleBackgroundMusic(): boolean {
    if (this.isBackgroundPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  static isBackgroundMusicPlaying(): boolean {
    return this.isBackgroundPlaying;
  }

  private static playMeditationLoop() {
    if (!this.isBackgroundPlaying || !this.backgroundGainNode) return;

    const ctx = this.getContext();
    const oscillator1 = ctx.createOscillator();
    const oscillator2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    // Create a soft, meditative drone
    oscillator1.frequency.setValueAtTime(110, ctx.currentTime); // Base Om frequency
    oscillator2.frequency.setValueAtTime(165, ctx.currentTime); // Perfect fifth above
    
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(this.backgroundGainNode);

    oscillator1.start(ctx.currentTime);
    oscillator2.start(ctx.currentTime);
    
    // Loop every 8 seconds with slight variations
    const duration = 8;
    oscillator1.stop(ctx.currentTime + duration);
    oscillator2.stop(ctx.currentTime + duration);

    // Schedule next loop
    setTimeout(() => this.playMeditationLoop(), duration * 1000);
  }

  // Mood sounds
  static playMoodSound(mood: string) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (mood) {
      case 'angry':
        // Grunt sound - low frequency, harsh
        oscillator.frequency.setValueAtTime(80, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
      case 'sad':
        // Hmm sound - descending tone
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        break;
      case 'happy':
        // Happy sound - ascending cheerful tone
        oscillator.frequency.setValueAtTime(330, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
      case 'good':
        // Good sound - pleasant chime
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.15);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        break;
      case 'joy':
        // Joy sound - bright, multiple tones
        oscillator.frequency.setValueAtTime(550, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  // Energy sphere sound - ohm that gets louder
  static playEnergySound(level: number) {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Ohm sound - low frequency, meditative
    oscillator.frequency.setValueAtTime(110, ctx.currentTime); // Base Om frequency
    oscillator.type = 'sine';
    
    // Volume increases with energy level
    const volume = 0.1 + (level * 0.1); // 0.1 to 0.6
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  }

  // Zip sound
  static playZipSound() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Zip sound - quick frequency sweep
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}