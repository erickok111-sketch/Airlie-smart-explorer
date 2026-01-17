import { CATEGORIES } from "./config.js";
import { createMap, addPlaces, setPlacesFilter } from "./map.js";
import { loadGeoJSON, buildFilter } from "./data.js";
import { initCategoryBar, initBestTodayToggle } from "./ui.js";

(async function () {
  const map = createMap();
  const geojson = await loadGeoJSON();

  let selectedCategories = new Set(CATEGORIES);
  let bestTodayOnly = true;

  selectedCategories = initCategoryBar((set) => { selectedCategories = set; apply(); });
  bestTodayOnly = initBestTodayToggle((checked) => { bestTodayOnly = checked; apply(); });

  map.on("load", () => {
    addPlaces(map, geojson);
    apply();
  });

  function apply() {
    const filterExpr = buildFilter({ selectedCategories, bestTodayOnly });
    setPlacesFilter(map, filterExpr);
  }
})();
