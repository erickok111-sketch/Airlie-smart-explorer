import { CATEGORIES } from "./config.js";
import { loadPlacesGeoJSON, buildPlacesFilter } from "./data.js";
import { createMap, addPlacesSourceAndLayers, setPlacesFilter, setSelected } from "./map.js";
import { setupCategoryBar, setupBestTodayToggle, setupSheetClose, openSheet, renderPlaceDetail } from "./ui.js";

(async function main() {
  setupSheetClose();

  const map = createMap();
  const geojson = await loadPlacesGeoJSON();

  let selectedCategories = new Set(CATEGORIES);
  let bestTodayOnly = true;

  // UI wiring
  setupCategoryBar({
    categories: CATEGORIES,
    onToggle: (set) => {
      selectedCategories = set;
      applyFilter();
    }
  });

  bestTodayOnly = setupBestTodayToggle({
    onChange: (checked) => {
      bestTodayOnly = checked;
      applyFilter();
    }
  });

  map.on("load", () => {
    addPlacesSourceAndLayers(map, geojson);
    applyFilter();

    // Click clusters -> zoom in
    map.on("click", "places-clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ["places-clusters"] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource("places").getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
    });

    // Click POI -> sheet
    map.on("click", "places-icons", (e) => {
      const f = e.features?.[0];
      if (!f) return;

      const props = f.properties || {};

      // GeoJSON properties arrive as strings sometimes; normalise booleans:
      const norm = normalizeProps(props, f.geometry.coordinates);

      setSelected(map, norm.ID || "");
      renderPlaceDetail(norm);
      openSheet();

      // Pan map up a little so icon isn't behind sheet
      map.easeTo({ center: f.geometry.coordinates, offset: [0, -140], duration: 350 });
    });

    // Cursor hint
    map.on("mouseenter", "places-icons", () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", "places-icons", () => (map.getCanvas().style.cursor = ""));
  });

  function applyFilter() {
    const filter = buildPlacesFilter({ selectedCategories, bestTodayOnly });
    setPlacesFilter(map, filter);
  }

  function normalizeProps(props, coords) {
    const toBool = (v) => (v === true || v === "true" || v === "TRUE");
    const toNum = (v) => (typeof v === "number" ? v : Number(v));

    // Add lat/lng from geometry if missing
    const lng = coords?.[0];
    const lat = coords?.[1];

    return {
      ...props,
      ID: props.ID ?? props.Id ?? props.id,
      Name: props.Name,
      Category: props.Category,
      icon: props.icon,
      Best_today: toBool(props.Best_today),
      Rain_ok: props.Rain_ok === undefined ? undefined : toBool(props.Rain_ok),
      Wind_ok: props.Wind_ok === undefined ? undefined : toBool(props.Wind_ok),
      Tide_ok: props.Tide_ok === undefined ? undefined : toBool(props.Tide_ok),
      Latitude: props.Latitude !== undefined ? toNum(props.Latitude) : lat,
      Longitude: props.Longitude !== undefined ? toNum(props.Longitude) : lng
    };
  }
})();
