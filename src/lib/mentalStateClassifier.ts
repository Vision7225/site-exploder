/**
 * Simulated ML-based mental state classifier.
 * Uses EEG band power ratios as features for a decision-boundary model.
 */

export type MentalState = "relaxed" | "stressed" | "focused";

export interface MentalStateResult {
  state: MentalState;
  confidence: number;
  probabilities: Record<MentalState, number>;
}

interface BandAverages {
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
  gamma: number;
}

/**
 * Sigmoid activation for soft decision boundaries
 */
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Classify mental state from EEG band power averages.
 * Uses a simulated neural-network-style approach with learned weights.
 */
export function classifyMentalState(bands: BandAverages): MentalStateResult {
  const total = bands.alpha + bands.beta + bands.theta + bands.delta + bands.gamma + 1;

  // Normalised power ratios (features)
  const alphaRatio = bands.alpha / total;
  const betaRatio = bands.beta / total;
  const thetaRatio = bands.theta / total;
  const gammaRatio = bands.gamma / total;

  // Engagement index: Beta / (Alpha + Theta)
  const engagementIndex = bands.beta / (bands.alpha + bands.theta + 1);

  // Relaxation index: Alpha / (Beta + Gamma)
  const relaxationIndex = bands.alpha / (bands.beta + bands.gamma + 1);

  // Compute raw scores (simulated learned weights)
  const relaxedScore = sigmoid(
    2.5 * alphaRatio - 1.8 * betaRatio + 1.2 * thetaRatio + 1.5 * relaxationIndex - 0.8
  );
  const stressedScore = sigmoid(
    -1.5 * alphaRatio + 3.0 * betaRatio - 0.5 * thetaRatio + 2.0 * engagementIndex - 1.2
  );
  const focusedScore = sigmoid(
    -0.5 * alphaRatio + 1.5 * betaRatio - 1.0 * thetaRatio + 2.5 * gammaRatio + 1.0 * engagementIndex - 0.6
  );

  // Softmax normalisation
  const sum = relaxedScore + stressedScore + focusedScore;
  const probabilities: Record<MentalState, number> = {
    relaxed: Math.round((relaxedScore / sum) * 100),
    stressed: Math.round((stressedScore / sum) * 100),
    focused: Math.round((focusedScore / sum) * 100),
  };

  // Ensure they sum to 100
  const diff = 100 - (probabilities.relaxed + probabilities.stressed + probabilities.focused);
  const maxKey = (Object.keys(probabilities) as MentalState[]).reduce((a, b) =>
    probabilities[a] > probabilities[b] ? a : b
  );
  probabilities[maxKey] += diff;

  const state = maxKey;
  const confidence = probabilities[state];

  return { state, confidence, probabilities };
}
