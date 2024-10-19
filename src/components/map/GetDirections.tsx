import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaWalking, FaCar } from "react-icons/fa";

interface GetDirectionsProps {
  userLat: number;
  userLng: number;
  eventLat: number;
  eventLng: number;
  eventName: string;
  onRouteChange: (
    routeData: RouteData | null,
    mode: "walking" | "driving"
  ) => void;
}

interface RouteData {
  distance: number;
  duration: number;
  geometry: number[][];
}

const GetDirections: React.FC<GetDirectionsProps> = ({
  userLat,
  userLng,
  eventLat,
  eventLng,
  eventName,
  onRouteChange,
}) => {
  const [walkingRoute, setWalkingRoute] = useState<RouteData | null>(null);
  const [drivingRoute, setDrivingRoute] = useState<RouteData | null>(null);
  const [activeMode, setActiveMode] = useState<"walking" | "driving">(
    "walking"
  );

  const fetchRoute = async (profile: "foot" | "car") => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/${profile}/${userLng},${userLat};${eventLng},${eventLat}?overview=full&geometries=geojson`
      );
      const route = response.data.routes[0];
      let duration = route.duration / 60; // Convert to minutes

      // Adjust walking duration based on 5 km/h speed
      if (profile === "foot") {
        const distanceKm = route.distance / 1000;
        duration = (distanceKm / 5) * 60; // 5 km/h walking speed
      }

      return {
        distance: route.distance / 1000, // Convert to km
        duration: duration,
        geometry: route.geometry.coordinates,
      };
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchRoute("foot").then((route) => {
      setWalkingRoute(route);
      if (activeMode === "walking") onRouteChange(route, "walking");
    });
    fetchRoute("car").then((route) => {
      setDrivingRoute(route);
      if (activeMode === "driving") onRouteChange(route, "driving");
    });
  }, [userLat, userLng, eventLat, eventLng, onRouteChange]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (hours === 0) return `${remainingMinutes} min`;
    return `${hours} h ${remainingMinutes} min`;
  };

  const handleModeChange = (mode: "walking" | "driving") => {
    setActiveMode(mode);
    onRouteChange(mode === "walking" ? walkingRoute : drivingRoute, mode);
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">
        Get Directions to {eventName}
      </h4>
      <div className="flex space-x-4 mb-4">
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded ${
            activeMode === "walking" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleModeChange("walking")}
        >
          <FaWalking />
          <span>
            Walking:{" "}
            {walkingRoute
              ? formatDuration(walkingRoute.duration)
              : "Calculating..."}
          </span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded ${
            activeMode === "driving" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => handleModeChange("driving")}
        >
          <FaCar />
          <span>
            Driving:{" "}
            {drivingRoute
              ? formatDuration(drivingRoute.duration)
              : "Calculating..."}
          </span>
        </button>
      </div>
      <div className="mt-4">
        <h5 className="font-semibold">Directions:</h5>
        <p>
          {activeMode === "walking" ? "Walking" : "Driving"} distance:{" "}
          {activeMode === "walking"
            ? walkingRoute?.distance.toFixed(2)
            : drivingRoute?.distance.toFixed(2)}{" "}
          km
        </p>
        <p>
          Estimated time:{" "}
          {activeMode === "walking"
            ? formatDuration(walkingRoute?.duration || 0)
            : formatDuration(drivingRoute?.duration || 0)}
        </p>
      </div>
    </div>
  );
};

export default GetDirections;
