import React from "react";
import axios from "axios";
import Icon from "@mdi/react";
import { mdiMagnify, mdiRefresh } from "@mdi/js";
import { categoryIcons } from "./categoryIcons";
import { LatLng } from "leaflet";

interface SearchComponentProps {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  distanceFilter: number;
  setDistanceFilter: (value: number) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleReset: () => void;
  setSearchResult: React.Dispatch<React.SetStateAction<LatLng | null>>;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchLocation,
  setSearchLocation,
  dateFilter,
  setDateFilter,
  categoryFilter,
  setCategoryFilter,
  distanceFilter,
  setDistanceFilter,
  handleSearch,
  handleReset,
  setSearchResult,
}) => {
  const handleGeocode = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation},Dhaka,Bangladesh`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchResult(new LatLng(parseFloat(lat), parseFloat(lon)));
        return true;
      } else {
        alert("Location not found in Dhaka");
        return false;
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("Error searching for location");
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const geocodeSuccess = await handleGeocode();
    if (geocodeSuccess) {
      handleSearch(e);
    }
  };

  return (
    <div className="bg-white p-4 overflow-y-auto h-full">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search for a location in Dhaka"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {Object.keys(categoryIcons).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="distance"
            className="block text-sm font-medium text-gray-700"
          >
            Distance (km)
          </label>
          <input
            id="distance"
            type="number"
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
            min="1"
            max="50"
            step="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-grow bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={!searchLocation}
          >
            <Icon path={mdiMagnify} size={1} className="mr-2" />
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <Icon path={mdiRefresh} size={1} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
