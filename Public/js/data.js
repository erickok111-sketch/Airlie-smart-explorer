import { GEOJSON_URL } from "./config.js";

export async function loadPlacesGeoJSON() {
  const res = await fetch(GEOJSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load GeoJSON: ${res.status}`);
  return await res.json();
}

/**
 * Build a Mapbox filter expression:
 * - include selected categories
 * - optionally require Best_today = true
 */
export function buildPlacesFilter({ selectedCategories, bestTodayOnly }) {
  const cats = Array.from(selectedCategories);

  const catFilter = ["in", ["get", "Category"], ["literal", cats]];
  const notCluster = ["!", ["has", "point_count"]];

  if (bestTodayOnly) {
    return ["all", notCluster, catFilter, ["==", ["get", "Best_today"], true]];
  }
  return ["all", notCluster, catFilter];
}
