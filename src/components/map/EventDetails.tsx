import React, { useState } from "react";
import { Event } from "../../interfaces/Event";
import { categoryIcons } from "./categoryIcons";
import { Weather } from "./Weather";
import GetDirections from "./GetDirections";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaRuler,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface EventDetailsProps {
  event: Event;
  distance: number;
  userLat: number;
  userLng: number;
}

interface EventDetailItemProps {
  Icon: IconType;
  text: string;
  label: string;
}

interface RouteData {
  distance: number;
  duration: number;
  geometry: number[][];
}

const EventDetailItem: React.FC<EventDetailItemProps> = ({
  Icon,
  text,
  label,
}) => (
  <div className="flex items-center space-x-3 py-2">
    <Icon className="text-gray-600 text-lg flex-shrink-0" />
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-sm text-gray-800">{text}</p>
    </div>
  </div>
);

export const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  distance,
  userLat,
  userLng,
}) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [activeMode, setActiveMode] = useState<"walking" | "driving">(
    "walking"
  );

  const handleRouteChange = (
    newRouteData: RouteData | null,
    mode: "walking" | "driving"
  ) => {
    setRouteData(newRouteData);
    setActiveMode(mode);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-6">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Event Details
            </h3>
            <EventDetailItem
              Icon={FaClock}
              label="Date & Time"
              text={event.date}
            />
            <EventDetailItem
              Icon={categoryIcons[event.category]?.icon || FaCalendar}
              label="Category"
              text={event.category}
            />
            <EventDetailItem
              Icon={FaMapMarkerAlt}
              label="Address"
              text={event.address}
            />
            <EventDetailItem
              Icon={FaRuler}
              label="Distance"
              text={`${distance.toFixed(2)} km`}
            />
            <EventDetailItem
              Icon={FaDollarSign}
              label="Price"
              text={
                event.ticketPrice !== undefined && event.ticketPrice !== null
                  ? `${event.ticketPrice} BDT`
                  : event.ticketPrice === 0
                  ? "Free"
                  : "Price not available"
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Weather
            </h3>
            <Weather
              lat={event.location.lat}
              lng={event.location.lng}
              eventId={event.id}
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Directions
          </h3>
          <GetDirections
            userLat={userLat}
            userLng={userLng}
            eventLat={event.location.lat}
            eventLng={event.location.lng}
            eventName={event.title}
            onRouteChange={handleRouteChange}
          />
        </div>
      </div>

      <div className="h-96 w-full">
        <MapContainer
          center={[
            (userLat + event.location.lat) / 2,
            (userLng + event.location.lng) / 2,
          ]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[userLat, userLng]} />
          <Marker position={[event.location.lat, event.location.lng]} />
          {routeData && (
            <Polyline
              positions={routeData.geometry.map((coord) => [
                coord[1],
                coord[0],
              ])}
              color="#3B82F6"
              weight={4}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};
