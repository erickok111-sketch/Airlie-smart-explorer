import { GEOJSON_URL } from "./config.js";

export async function loadGeoJSON() {
  const res = await fetch(GEOJSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
  return await res.json();
}

export function buildFilter({ selectedCategories, bestTodayOnly }) {
  const cats = Array.from(selectedCategories);
  const catFilter = ["in", ["get", "Category"], ["literal", cats]];
  const notCluster = ["!", ["has", "point_count"]];

  return bestTodayOnly
    ? ["all", notCluster, catFilter, ["==", ["get", "Best_today"], true]]
    : ["all", notCluster, catFilter];
}
