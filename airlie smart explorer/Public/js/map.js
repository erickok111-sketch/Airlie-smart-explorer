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

export function addPlacesSourceAndLayers(map, geojson) {
  map.addSource("places", {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterRadius: 50,
    clusterMaxZoom: 14
  });

  // Clusters
  map.addLayer({
    id: "places-clusters",
    type: "circle",
    source: "places",
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 30, 26],
      "circle-color": "#111",
      "circle-opacity": 0.25
    }
  });

  map.addLayer({
    id: "places-cluster-count",
    type: "symbol",
    source: "places",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-size": 12
    },
    paint: { "text-color": "#111" }
  });

  // Individual icons (uses properties.icon)
  map.addLayer({
    id: "places-icons",
    type: "symbol",
    source: "places",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": ["get", "icon"],
      "icon-size": ["interpolate", ["linear"], ["zoom"], 12, 0.6, 14, 1.0, 16, 1.2],
      "icon-allow-overlap": true
    },
    paint: {
      "icon-opacity": ["case", ["==", ["get", "Best_today"], true], 1, 0.4]
    }
  });

  // Selected highlight
  map.addLayer({
    id: "places-selected",
    type: "circle",
    source: "places",
    filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "ID"], ""]],
    paint: {
      "circle-radius": 18,
      "circle-color": "#fff",
      "circle-opacity": 0.6
    }
  });
}

export function setPlacesFilter(map, filterExpr) {
  if (map.getLayer("places-icons")) {
    map.setFilter("places-icons", filterExpr);
  }
}

export function setSelected(map, id) {
  if (map.getLayer("places-selected")) {
    map.setFilter("places-selected", ["all", ["!", ["has", "point_count"]], ["==", ["get", "ID"], id]]);
  }
}
