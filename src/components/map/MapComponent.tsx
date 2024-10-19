import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng } from "leaflet";
import { SearchMarker } from "./SearchMarker";
import { Event } from "../../interfaces/Event";
import axios from "axios";

interface MapComponentProps {
  searchResult: LatLng | null;
  setSearchResult: React.Dispatch<React.SetStateAction<LatLng | null>>;
  nearbyEvents: Event[];
  distanceFilter: number;
}

const MapComponent: React.FC<MapComponentProps> = ({
  searchResult,
  setSearchResult,
  nearbyEvents,
  distanceFilter,
}) => {
  const [userLocationName, setUserLocationName] = useState<string>("");

  useEffect(() => {
    if (searchResult) {
      fetchLocationName(searchResult.lat, searchResult.lng);
    }
  }, [searchResult]);

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = response.data.address;
      const name =
        address.city ||
        address.town ||
        address.village ||
        address.hamlet ||
        "Unknown location";
      setUserLocationName(name);
    } catch (error) {
      console.error("Error fetching location name:", error);
      setUserLocationName("Unknown location");
    }
  };

  return (
    <MapContainer
      center={searchResult ? [searchResult.lat, searchResult.lng] : [23.8103, 90.4125]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {searchResult && (
        <SearchMarker
          position={searchResult}
          nearbyEvents={nearbyEvents}
          radius={distanceFilter}
  
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;