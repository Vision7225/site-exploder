/**
 * Realistic synthetic EEG signal generator using superimposed sinusoidal models.
 *
 * Each brainwave band is modelled as a sum of sine waves at characteristic
 * frequencies with amplitude modulation and physiological noise.
 *
 *  Band        Freq (Hz)     Typical µV
 *  Delta       0.5 – 4       20 – 200
 *  Theta       4 – 8         20 – 100
 *  Alpha       8 – 13        20 – 60
 *  Beta        13 – 30       5 – 30
 *  Gamma       30 – 100      2 – 20
 */

// ── helpers ──────────────────────────────────────────────────────────────
const TWO_PI = Math.PI * 2;

/** Gaussian-ish noise via Box-Muller */
function gaussNoise(sigma = 1): number {
  const u1 = Math.random() || 1e-10;
  const u2 = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(TWO_PI * u2);
}

/** Sum of sines at given frequencies with amplitude envelope */
function bandSignal(
  t: number,
  freqs: number[],
  amplitudes: number[],
  phaseOffsets: number[],
): number {
  let v = 0;
  for (let i = 0; i < freqs.length; i++) {
    v += amplitudes[i] * Math.sin(TWO_PI * freqs[i] * t + phaseOffsets[i]);
  }
  return v;
}

// ── per-session random phase offsets (stay constant during a scan) ────────
let sessionPhases: number[] | null = null;

export function resetSession(): void {
  sessionPhases = null;
}

function getPhases(count: number): number[] {
  if (!sessionPhases || sessionPhases.length < count) {
    sessionPhases = Array.from({ length: count }, () => Math.random() * TWO_PI);
  }
  return sessionPhases;
}

// ── wave point ───────────────────────────────────────────────────────────
export interface EEGWavePoint {
  /** elapsed seconds */
  time: number;
  /** µV values for each band */
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  gamma: number;
  /** derived 0-100 stress score */
  stress: number;
}

/**
 * Generate a realistic EEG sample at time `t` (seconds).
 *
 * The frequencies and amplitudes are modelled on typical scalp EEG
 * characteristics. A slow amplitude modulation (~0.1 Hz) simulates
 * natural fluctuations in arousal / attention.
 */
export function generateEEGSample(t: number): EEGWavePoint {
  const ph = getPhases(20);

  // slow modulators (simulate arousal shifts)
  const arousal = 0.7 + 0.3 * Math.sin(0.08 * TWO_PI * t + ph[0]);
  const drowsy = 0.6 + 0.4 * Math.sin(0.05 * TWO_PI * t + ph[1]);

  // ── Delta (0.5-4 Hz) — dominant in deep sleep ─────────────────────────
  const delta =
    bandSignal(t, [0.5, 1.0, 1.5, 2.5, 3.5], [80, 60, 40, 25, 15], ph.slice(2, 7)) *
      (1.2 - arousal * 0.5) +
    gaussNoise(8);

  // ── Theta (4-8 Hz) — drowsiness / light sleep ─────────────────────────
  const theta =
    bandSignal(t, [4.0, 5.5, 6.5, 7.5], [35, 28, 20, 12], ph.slice(7, 11)) *
      drowsy +
    gaussNoise(5);

  // ── Alpha (8-13 Hz) — relaxed wakefulness ─────────────────────────────
  const alphaEnvelope = 0.5 + 0.5 * Math.sin(0.12 * TWO_PI * t + ph[11]); // alpha blocking
  const alpha =
    bandSignal(t, [8.5, 10.0, 11.0, 12.5], [30, 40, 25, 15], ph.slice(11, 15)) *
      alphaEnvelope *
      arousal +
    gaussNoise(4);

  // ── Beta (13-30 Hz) — active thinking / stress ────────────────────────
  const beta =
    bandSignal(t, [14, 18, 22, 27], [12, 10, 8, 5], ph.slice(15, 19)) *
      arousal +
    gaussNoise(3);

  // ── Gamma (30-100 Hz) — higher cognition ──────────────────────────────
  const gamma =
    bandSignal(t, [35, 45, 60, 80], [6, 4, 3, 2], [ph[19], ph[0], ph[3], ph[7]]) *
      arousal +
    gaussNoise(2);

  // ── Stress index ──────────────────────────────────────────────────────
  // Based on Beta / (Alpha + Theta) ratio — a common EEG stress marker.
  const absBeta = Math.abs(beta);
  const absAlpha = Math.abs(alpha);
  const absTheta = Math.abs(theta);
  const ratio = absBeta / (absAlpha + absTheta + 1); // +1 avoids div/0
  // Map ratio to 0-100 with a sigmoid-like curve
  const stress = Math.round(Math.min(100, Math.max(0, ratio * 45 + gaussNoise(3))));

  return {
    time: Math.round(t * 10) / 10,
    alpha: Math.round(alpha * 10) / 10,
    beta: Math.round(beta * 10) / 10,
    theta: Math.round(theta * 10) / 10,
    delta: Math.round(delta * 10) / 10,
    gamma: Math.round(gamma * 10) / 10,
    stress,
  };
}
