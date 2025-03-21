// Central configuration for animations to ensure consistency
export const animationConfig = {
  // Transition durations
  durations: {
    fast: "150ms",
    medium: "200ms",
    slow: "300ms",
  },

  // Easing functions
  easings: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)", // Material Design standard easing
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // Delay before animations start
  delays: {
    none: "0ms",
    short: "50ms",
    medium: "100ms",
  },
}

// Helper function to create consistent transition strings
export function createTransition(
  properties: string[],
  duration: keyof typeof animationConfig.durations = "medium",
  easing: keyof typeof animationConfig.easings = "default",
  delay: keyof typeof animationConfig.delays = "none",
): string {
  return properties
    .map(
      (property) =>
        `${property} ${animationConfig.durations[duration]} ${animationConfig.easings[easing]} ${animationConfig.delays[delay]}`,
    )
    .join(", ")
}

