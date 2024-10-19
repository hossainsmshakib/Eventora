import { IconType } from "react-icons/lib";
import { divIcon } from "leaflet";
import { renderToString } from "react-dom/server";

export const createCustomIcon = (Icon: IconType, color: string) => {
  return divIcon({
    html: renderToString(
      <div style={{ color }}>
        <Icon size={24} />
      </div>
    ),
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};
