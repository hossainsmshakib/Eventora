import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/rootReducer";
import { AppDispatch } from "../redux/store";
import { fetchEvents } from "../redux/thunks/eventThunks";
import { LatLng } from "leaflet";
import MapComponent from "../components/map/MapComponent";
import SearchComponent from "../components/map/SearchComponent";
import { Event } from "../interfaces/Event";

const EventDiscoveryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.events.events);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchResult, setSearchResult] = useState<LatLng | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(5);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (searchResult) {
      filterEvents(searchResult);
    }
  }, [searchResult, dateFilter, categoryFilter, distanceFilter, events]);

  const filterEvents = (searchLatLng: LatLng) => {
    const filtered = events.filter((event) => {
      const eventLatLng = new LatLng(event.location.lat, event.location.lng);
      const distance = eventLatLng.distanceTo(searchLatLng) / 1000;

      const dateMatch = dateFilter
        ? new Date(event.date).toDateString() ===
          new Date(dateFilter).toDateString()
        : true;
      const categoryMatch = categoryFilter
        ? event.category === categoryFilter
        : true;
      const distanceMatch = distance <= distanceFilter;

      return dateMatch && categoryMatch && distanceMatch;
    });
    setNearbyEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResult) {
      filterEvents(searchResult);
    }
  };

  const handleReset = () => {
    setSearchLocation("");
    setDateFilter("");
    setCategoryFilter("");
    setDistanceFilter(5);
    setSearchResult(null);
    setNearbyEvents([]);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white shadow-lg p-4">
        <SearchComponent
          searchLocation={searchLocation}
          setSearchLocation={setSearchLocation}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          distanceFilter={distanceFilter}
          setDistanceFilter={setDistanceFilter}
          handleSearch={handleSearch}
          handleReset={handleReset}
          setSearchResult={setSearchResult}
        />
      </div>
      <div className="flex-1 ml-4">
        <MapComponent
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          nearbyEvents={nearbyEvents}
          distanceFilter={distanceFilter}
        />
      </div>
    </div>
  );
};

export default EventDiscoveryPage;
