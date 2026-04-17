// Provide a route-safe default export for expo-router and re-export THEME
export { THEME } from '@features/onboarding/theme';

// Default export required by expo-router for route files. Keep it empty (no UI).
export default function OnboardingThemeRoute() {
  return null;
}

