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

  // Background soothing instrumental music
  static startBackgroundMusic() {
    if (this.isBackgroundPlaying) return;
    
    const ctx = this.getContext();
    this.backgroundGainNode = ctx.createGain();
    this.backgroundGainNode.connect(ctx.destination);
    this.backgroundGainNode.gain.setValueAtTime(0.05, ctx.currentTime); // Very low volume
    
    this.isBackgroundPlaying = true;
    this.playInstrumentalLoop();
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

  private static playInstrumentalLoop() {
    if (!this.isBackgroundPlaying || !this.backgroundGainNode) return;

    const ctx = this.getContext();
    
    // Create a soothing chord progression with soft instrumental tones
    const notes = [
      { freq: 261.63, start: 0, duration: 2 },    // C4
      { freq: 329.63, start: 0.5, duration: 2 },  // E4
      { freq: 392.00, start: 1, duration: 2 },    // G4
      { freq: 293.66, start: 2, duration: 2 },    // D4
      { freq: 349.23, start: 2.5, duration: 2 },  // F4
      { freq: 440.00, start: 3, duration: 2 },    // A4
      { freq: 246.94, start: 4, duration: 2 },    // B3
      { freq: 523.25, start: 4.5, duration: 1.5 }, // C5
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);
    filter.connect(this.backgroundGainNode);

    notes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const noteGain = ctx.createGain();
      
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);
      oscillator.type = 'triangle'; // Soft, warm tone
      
      // Gentle attack and decay
      noteGain.gain.setValueAtTime(0, ctx.currentTime + note.start);
      noteGain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + note.start + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.start + note.duration);
      
      oscillator.connect(noteGain);
      noteGain.connect(filter);
      
      oscillator.start(ctx.currentTime + note.start);
      oscillator.stop(ctx.currentTime + note.start + note.duration);
    });

    // Schedule next loop - 6 second cycles
    setTimeout(() => this.playInstrumentalLoop(), 6000);
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