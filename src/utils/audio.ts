/**
 * Audio Engine: Web Speech API for Mandarin & Web Audio API for Traditional Sounds
 */

class SoundEngine {
  private audioCtx: AudioContext | null = null;
  private muted = false;
  private speechId = 0;
  public get isMuted(): boolean { return this.muted; }
  public set isMuted(value: boolean) {
    this.muted = value;
    if (value) this.stopSpeech();
  }
  public speechRate: number = 0.85; // Default slow rate for elementary students

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play standard Chinese speech
  public speak(text: string, onEnd?: () => void, rateOverride?: number): void {
    const speechId = ++this.speechId;
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rateOverride ?? this.speechRate;
      utterance.pitch = 1.05; // Slightly clear and warm

      // Pick a Chinese voice if available
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => /^(zh[-_]CN|cmn[-_]CN)$/i.test(v.lang))
        ?? voices.find(v => /^(zh|cmn)([-_]|$)/i.test(v.lang) && !/(HK|yue)/i.test(v.lang));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      let finished = false;
      const finish = () => {
        if (finished || speechId !== this.speechId) return;
        finished = true;
        onEnd?.();
      };
      utterance.onend = finish;
      utterance.onerror = (event) => {
        if (event.error !== 'canceled' && event.error !== 'interrupted') finish();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech error:', e);
      if (onEnd) onEnd();
    }
  }

  // Stop ongoing speech
  public stopSpeech(): void {
    this.speechId++;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Web Audio Synthesizer: Crisp Woodblock (木鱼 / 竹简敲击音)
  public playWoodblock(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Ignore audio context errors
    }
  }

  // Web Audio Synthesizer: Jade/Bell Pentatonic Chime (玉佩风铃 · 答对音)
  public playChime(pitch: number = 880): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore
    }
  }

  // Web Audio Synthesizer: Victory Guzheng Arpeggio (通关筝鸣)
  public playVictoryArpeggio(): void {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq);
      }, i * 90);
    });
  }

  // Web Audio Synthesizer: Soft Gentle Bounce (答错轻触音)
  public playGentleOops(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Ignore
    }
  }

  // Chinese Gong / Bell resonance (铜钟悠远)
  public playGong(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundEngine();
