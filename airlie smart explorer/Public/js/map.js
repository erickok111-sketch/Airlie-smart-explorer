
import { MAPBOX_TOKEN, MAP_STYLE, MAP_CENTER, MAP_ZOOM } from "./config.js";

mapboxgl.accessToken = MAPBOX_TOKEN;

export function createMap() {
  const map = new mapboxgl.Map({
    container: "map",
    style: MAP_STYLE,
    center: MAP_CENTER,
    zoom: MAP_ZOOM
  });
  map.addControl(new mapboxgl.NavigationControl(), "top-right");
  return map;
}

export function addPlaces(map, geojson) {
  map.addSource("places", {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterRadius: 50,
    clusterMaxZoom: 14
  });

  map.addLayer({
    id: "places-icons",
    type: "symbol",
    source: "places",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 12, 0.6, 14, 1, 16, 1.2],
      "icon-allow-overlap": true
    },
    paint: {
      "icon-opacity": ["case", ["==", ["get", "Best_today"], true], 1, 0.4]
    }
  });
}

export function setPlacesFilter(map, filterExpr) {
  if (map.getLayer("places-icons")) map.setFilter("places-icons", filterExpr);
}
