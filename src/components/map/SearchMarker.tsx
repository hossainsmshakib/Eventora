import React from "react";
import { Marker, Popup, useMap, Circle } from "react-leaflet";
import { LatLng, LatLngTuple } from "leaflet";
import { Event } from "../../interfaces/Event";
import { createCustomIcon } from "./createCustomIcon";
import { categoryIcons } from "./categoryIcons";
import { EventDetails } from "./EventDetails";
import { FaSearch, FaCalendar } from "react-icons/fa";

interface SearchMarkerProps {
  position: LatLng;
  nearbyEvents: Event[];
  radius: number;
}

export const SearchMarker: React.FC<SearchMarkerProps> = ({
  position,
  nearbyEvents,
  radius,
}) => {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(position, 14);
  }, [map, position]);

  const searchIcon = createCustomIcon(FaSearch, "#FF0000");

  return (
    <>
      <Marker position={position} icon={searchIcon} />
      <Circle center={position} radius={radius * 1000} />
      {nearbyEvents.map((event) => {
        const eventLatLng = new LatLng(event.location.lat, event.location.lng);
        const distance = position.distanceTo(eventLatLng) / 1000;

        return (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng] as LatLngTuple}
            icon={createCustomIcon(
              categoryIcons[event.category]?.icon || FaCalendar,
              categoryIcons[event.category]?.color || "#000000"
            )}
          >
            <Popup>
              <EventDetails
                event={event}
                distance={distance}
                userLat={position.lat}
                userLng={position.lng}
              />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};
