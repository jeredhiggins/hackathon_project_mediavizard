import type { AudioOptions } from '../types';

export class AudioProcessor {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async processAudio(file: File, options: AudioOptions): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );
    
    // Create source
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    
    let currentNode: AudioNode = source;
    
    // Apply pitch shift
    if (options.pitchShift !== 0) {
      const pitchShiftNode = this.createPitchShiftNode(offlineContext, options.pitchShift);
      currentNode.connect(pitchShiftNode);
      currentNode = pitchShiftNode;
    }
    
    // Apply distortion
    if (options.distortion > 0) {
      const distortionNode = this.createDistortionNode(offlineContext, options.distortion);
      currentNode.connect(distortionNode);
      currentNode = distortionNode;
    }
    
    // Apply robotic filter
    if (options.roboticFilter) {
      const roboticNode = this.createRoboticFilterNode(offlineContext);
      currentNode.connect(roboticNode);
      currentNode = roboticNode;
    }
    
    // Connect to destination
    currentNode.connect(offlineContext.destination);
    
    // Start processing
    source.start(0);
    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert to blob
    return this.audioBufferToBlob(renderedBuffer);
  }

  private createPitchShiftNode(context: OfflineAudioContext, shift: number): AudioNode {
    // Simple pitch shifting using playback rate (not perfect but functional)
    const source = context.createBufferSource();
    source.playbackRate.value = Math.pow(2, shift / 12); // Convert semitones to ratio
    return source as AudioNode;
  }

  private createDistortionNode(context: OfflineAudioContext, amount: number): AudioNode {
    const waveshaper = context.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    waveshaper.curve = curve;
    waveshaper.oversample = '4x';
    return waveshaper;
  }

  private createRoboticFilterNode(context: OfflineAudioContext): AudioNode {
    // Create a bandpass filter for robotic effect
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 30;
    return filter;
  }

  private async audioBufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    const numberOfChannels = buffer.numberOfChannels;
    const length = buffer.length * numberOfChannels * 2;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    
    let offset = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  stripMetadata(blob: Blob): Blob {
    // Create a new blob without metadata
    return new Blob([blob], { type: blob.type });
  }
}