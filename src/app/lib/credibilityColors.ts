// Credibility bar color calculation with smooth gradient interpolation
export const getCredibilityColor = (score: number): string => {
  // Ensure score is between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));
  
  // Define color stops for smooth gradient
  const colorStops = [
    { percent: 0, color: '#ef4444' },   // Red
    { percent: 25, color: '#f97316' },  // Orange-red
    { percent: 50, color: '#facc15' },  // Yellow
    { percent: 75, color: '#22c55e' },  // Green
    { percent: 100, color: '#15803d' }  // Dark green
  ];
  
  // Find the two color stops to interpolate between
  let startStop = colorStops[0];
  let endStop = colorStops[colorStops.length - 1];
  
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (clampedScore >= colorStops[i].percent && clampedScore <= colorStops[i + 1].percent) {
      startStop = colorStops[i];
      endStop = colorStops[i + 1];
      break;
    }
  }
  
  // Calculate interpolation factor
  const factor = (clampedScore - startStop.percent) / (endStop.percent - startStop.percent);
  
  // Interpolate between colors
  const interpolatedColor = interpolateColor(startStop.color, endStop.color, factor);
  
  return interpolatedColor;
};

// Helper function to interpolate between two hex colors
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Get shimmer intensity based on credibility score
export const getShimmerIntensity = (score: number): string => {
  if (score < 25) return 'none';
  if (score < 50) return 'low';
  if (score < 75) return 'medium';
  return 'high';
};

// Get shimmer animation duration based on intensity
export const getShimmerDuration = (intensity: string): string => {
  switch (intensity) {
    case 'none': return '0s';
    case 'low': return '3s';
    case 'medium': return '2.5s';
    case 'high': return '2s';
    default: return '2.5s';
  }
}; 