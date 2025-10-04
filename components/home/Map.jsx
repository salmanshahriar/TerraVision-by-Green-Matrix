"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Plus, Minus, Locate, Navigation, Layers, Map, LassoSelect } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import SatelliteImagery from "./SatelliteImagery";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DrawControl = ({ setOpen, setDrawnLayer, onDrawControlReady }) => {
  const map = useMap();
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const drawControlRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const initializeDrawControl = () => {
      const drawnItems = drawnItemsRef.current;
      map.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: { polygon: true, polyline: false, rectangle: false, circle: false, marker: false },
      });
      drawControlRef.current = drawControl;

      map.on(L.Draw.Event.CREATED, (e) => {
        const { layer } = e;
        drawnItems.clearLayers();
        drawnItems.addLayer(layer);
        setDrawnLayer(layer);
        setOpen(true);
        layer.on("click", () => setOpen(true));
      });

      map.invalidateSize();

      onDrawControlReady({
        startDrawing: () => drawControlRef.current && new L.Draw.Polygon(map, drawControlRef.current.options.draw.polygon).enable(),
        clearDrawings: () => {
          drawnItemsRef.current.clearLayers();
          setDrawnLayer(null);
        },
      });
    };

    const timeout = setTimeout(initializeDrawControl, 0);

    return () => {
      clearTimeout(timeout);
      map.off(L.Draw.Event.CREATED);
      map.removeLayer(drawnItemsRef.current);
    };
  }, [map, setOpen, setDrawnLayer, onDrawControlReady]);

  return null;
};

const LocationSearch = ({ onLocationFound }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchSuggestions = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=5&lang=en`);
      const data = await response.json();
      const transformedSuggestions = (data.features || []).map((feature) => ({
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        display_name: formatPhotonResult(feature.properties),
        place_name: feature.properties.name || feature.properties.street || "Unknown",
        properties: feature.properties,
      }));
      setSuggestions(transformedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Photon suggestions error:", error);
    }
  };

  const formatPhotonResult = (properties) => {
    const parts = [];
    if (properties.name) parts.push(properties.name);
    if (properties.street) parts.push(properties.street);
    if (properties.housenumber) parts.push(properties.housenumber);
    if (properties.city) parts.push(properties.city);
    if (properties.state) parts.push(properties.state);
    if (properties.country) parts.push(properties.country);
    return parts.filter(Boolean).join(", ");
  };

  const selectLocation = (suggestion) => {
    const { lat, lon, display_name } = suggestion;
    onLocationFound([lat, lon], display_name);
    setSearchQuery(suggestion.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(`https://photon.komoot.io/api?q=${encodeURIComponent(searchQuery)}&limit=1&lang=en`);
      const data = await response.json();
      if (data.features?.length) {
        const feature = data.features[0];
        const lat = feature.geometry.coordinates[1];
        const lon = feature.geometry.coordinates[0];
        const display_name = formatPhotonResult(feature.properties);
        onLocationFound([lat, lon], display_name);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Photon search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchSuggestions(value);
  };

  return (
    <div className="p-3 ">
      <div className="pb-3">
        <label className="block text-sm font-semibold text-gray-800 mb-2.5">Search Area:</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") searchLocation();
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search for a place..."
            className="w-full placeholder-gray-500 border border-2 border-black/30 shadow-inner rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/95 backdrop-blur-sm transition-all duration-200 hover:border-gray-400"
            aria-label="Search for a location"
          />
          <button
            onClick={searchLocation}
            disabled={isSearching || !searchQuery.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors duration-200 disabled:opacity-50"
            title="Search location"
            aria-label="Search location"
          >
            {isSearching ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white/96 backdrop-blur-md border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto mt-2 z-50 transition-all duration-200">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectLocation(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50/80 text-sm border-b border-gray-100/50 last:border-b-0 focus:outline-none focus:bg-blue-50/80 transition-all duration-150 first:rounded-t-lg last:rounded-b-lg"
                  aria-label={`Select ${suggestion.place_name}`}
                >
                  <div className="font-medium text-gray-800 truncate">{suggestion.place_name}</div>
                  <div className="text-xs text-gray-500 truncate mt-0.5">{suggestion.display_name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MapControls = ({ onLocationFound }) => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const markerRef = useRef(null);

  if (!map) {
    return null;
  }

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  const locateMe = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = [position.coords.latitude, position.coords.longitude];
          onLocationFound(coordinates, "Your Location");
          if (markerRef.current) map.removeLayer(markerRef.current);
          markerRef.current = L.marker(coordinates, {
            icon: L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
              shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          }).addTo(map).bindPopup("Your Location").openPopup();
          setIsLocating(false);
        },
        (error) => {
          alert("Could not get your location. Please enable location services.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLocating(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
      <div className="bg-white/98 backdrop-blur-md shadow-xl rounded-xl border border-gray-200/50">
        <div className="flex items-center ">
          <button
            onClick={handleZoomIn}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Zoom In"
          >
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Zoom Out"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-gray-200 mx-1" />
          <button
            onClick={locateMe}
            disabled={isLocating}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Locate Me"
          >
            {isLocating ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Locate className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const LayersSelector = ({ mapType, setMapType }) => {
  return (
    <div className="absolute top-6 right-6 z-[1000] flex flex-col space-y-2 pt-16">
      <div className="bg-white backdrop-blur-md shadow-xl rounded-lg border border-gray-200/50">
        <div className="p-2">
        
          <div className="">
            {[
              {
                value: "satellite",
                label: "Satellite view",
                icon: <Layers className="w-4 h-4" />,
              },
              {
                value: "satellite+names+roads",
                label: "Hybrid view",
                icon: <Map className="w-4 h-4" />,
              },
              {
                value: "roads",
                label: "Streets view",
                icon: <Navigation className="w-4 h-4" />,
              },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setMapType(type.value)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                  mapType === type.value 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex-shrink-0">{type.icon}</div>
                <span className="font-medium text-sm">{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LayersControl = ({ mapType, setMapType }) => {
  const [showLayers, setShowLayers] = useState(false);
  const mapTypes = [
    {
      value: "satellite+names+roads",
      label: "Hybrid",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
          <path d="M9 3v18" />
          <path d="M15 3v18" />
          <circle cx="6" cy="12" r="1" />
          <circle cx="12" cy="9" r="1" />
          <circle cx="18" cy="15" r="1" />
          <path d="M18 6a6 6 0 0 0-12 0" />
        </svg>
      ),
      description: "Satellite with labels",
    },
    {
      value: "roads",
      label: "Streets",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
      description: "Street view with roads",
    },
    {
      value: "satellite",
      label: "Satellite",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      description: "Pure satellite imagery",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowLayers(!showLayers)}
        className={`bg-white/98 backdrop-blur-md shadow-xl rounded-xl p-4 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group ${
          showLayers ? "bg-blue-50/90 border-blue-200/50" : ""
        }`}
        title="Map Layers"
      >
        <div className="flex items-center space-x-2">
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${
              showLayers ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
      </button>

      {showLayers && (
        <div className="absolute top-0 right-full bg-white/98 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200/50 overflow-hidden min-w-[320px] z-[2000] mr-4 animate-in slide-in-from-right-2 duration-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-sm">Map Layers</h3>
              <button
                onClick={() => setShowLayers(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-2">
              {mapTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setMapType(type.value);
                    setShowLayers(false);
                  }}
                  className={`w-full text-left transition-all duration-200 rounded-xl p-3 group ${
                    mapType === type.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        mapType === type.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{type.label}</div>
                      <div
                        className={`text-xs mt-1 ${
                          mapType === type.value ? "text-blue-100" : "text-gray-500 group-hover:text-gray-600"
                        }`}
                      >
                        {type.description}
                      </div>
                    </div>
                    {mapType === type.value && <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DateRangeSelector = ({ dateRange, setDateRange }) => (
  <div className="px-3 pb-4">
    <h3 className="text-sm font-semibold text-gray-800 mb-2">Date Range:</h3>
    <div className="grid grid-cols- gap-3">
      <div>
        <label className="block text-xs font-medium mb-2">From</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          className="w-full px-3 py-2.5 text-sm bg-white/95 border border-2 border-black/30 shadow-inner  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-2">To</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          className="w-full px-3 py-2.5 text-sm bg-white/95 border border-2 border-black/30 shadow-inner rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
        />
      </div>
    </div>
  </div>
);

const AreaSelector = ({ startDrawing, clearDrawings }) => (
  <div className="px-3 pb-3">
    <h3 className="text-sm font-semibold text-gray-800 mb-2">Area Selection:</h3>
    <div className="space-y-2">
      <button
        onClick={() => typeof startDrawing === "function" ? startDrawing() : null}
        className="w-full bg-blue-600 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg text-sm transition-all duration-200 border border-blue-800 hover:shadow-lg flex items-center justify-center space-x-2 group"
        aria-label="Start drawing area"
      >
        <LassoSelect className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span>Select Area</span>
      </button>
      <button
        onClick={() => typeof clearDrawings === "function" ? clearDrawings() : null}
        className="w-full bg-red-500 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2 group"
        aria-label="Clear drawn area"
      >
        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span>Clear Area</span>
      </button>
    </div>
  </div>
);

const GreenishMap = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [mapType, setMapType] = useState("satellite+names+roads");
  const [dateRange, setDateRange] = useState({ from: "2020-01-01", to: "2025-08-01" });
  const [drawnLayer, setDrawnLayer] = useState(null);
  const [drawControl, setDrawControl] = useState({ startDrawing: () => {}, clearDrawings: () => {} });
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLocationFound = (coordinates, displayName) => {
    mapRef?.setView(coordinates, 15);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative h-screen w-full bg-gray-50">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        className="w-full h-full z-0"
        zoomControl={false}
        ref={setMapRef}
      >
        {mapType === "satellite" && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri &copy; OpenStreetMap"
            subdomains={["server", "services"]}
          />
        )}
        {mapType === "roads" && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
            subdomains={["a", "b", "c"]}
          />
        )}
        {mapType === "satellite+names+roads" && (
          <>
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution=""
              subdomains={["server", "services"]}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
              subdomains={["server", "services"]}
            />
          </>
        )}
        <DrawControl setOpen={setOpen} setDrawnLayer={setDrawnLayer} onDrawControlReady={setDrawControl} />
        <MapControls onLocationFound={handleLocationFound} />
        <LayersSelector mapType={mapType} setMapType={setMapType} />
      </MapContainer>
      
      <div className="absolute top-6 left-6 max-w-sm mt-16 shadow-lg">
        <div className="bg-white shadow-inner shadow-inner rounded-xl border-t-2 border-l-2 border-white border-r border-b border-r-gray-300/60 border-b-gray-300/60 overflow-hidden">
          <LocationSearch onLocationFound={handleLocationFound} />
          <div className="">
            <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <div className="">
            <AreaSelector startDrawing={drawControl.startDrawing} clearDrawings={drawControl.clearDrawings} />
          </div>
        </div>
      </div>
      
      <SatelliteImagery 
        open={open} 
        setOpen={setOpen} 
        activeLayer={mapType} 
        dateRange={dateRange} 
        drawnLayer={drawnLayer}
      />
    </div>
  );
};

export default GreenishMap;