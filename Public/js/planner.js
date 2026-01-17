export function buildPlanner(features) {
  return {
    morning: features.filter(f => f.properties.Morning_ok),
    midday: features.filter(f => f.properties.Midday_ok),
    afternoon: features.filter(f => f.properties.Afternoon_ok),
    sunset: features.filter(f => f.properties.Sunset_ok)
  };
}
