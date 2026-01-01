class AudioManager {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private init() {
        if (!this.ctx && typeof window !== 'undefined') {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        }
    }

    private createMagicSound(freq: number, duration: number, type: OscillatorType = 'sawtooth') {
        this.init();
        if (!this.ctx || !this.masterGain) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        // Frequency sweep for "energy" feel
        osc.frequency.exponentialRampToValueAtTime(freq * 2.5, this.ctx.currentTime + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    private createWarImpact(duration: number) {
        this.init();
        if (!this.ctx || !this.masterGain) return;

        // Bass impact
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);

        // Noise crackle for "impact"
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        const noiseFilter = this.ctx.createBiquadFilter();

        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);

        noiseGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start();
    }

    playMove() {
        // Elegant energy sound
        this.createMagicSound(300, 0.3, 'sine');
        setTimeout(() => this.createMagicSound(600, 0.1, 'triangle'), 50);
    }

    playCapture() {
        // War impact + energy burst
        this.createWarImpact(0.5);
        this.createMagicSound(100, 0.4, 'sawtooth');
    }

    playWin() {
        // Heavenly energy chord
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => this.createMagicSound(f, 1.5, 'sine'), i * 100);
        });
    }

    playLoss() {
        // Dark chaotic energy decay
        [220, 180, 140, 100].forEach((f, i) => {
            setTimeout(() => {
                this.createWarImpact(0.8);
                this.createMagicSound(f, 1.0, 'sawtooth');
            }, i * 200);
        });
    }
}

export const audioManager = new AudioManager();
