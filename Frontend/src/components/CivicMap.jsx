import { useCallback, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { toLatLng, getIssueTitle } from '../lib/issueService';
import { issueDivIcon, userLocationDivIcon } from '../lib/leafletIcons';

// Keeps a ref to the underlying Leaflet map instance so the "Recenter on
// me" button (rendered outside MapContainer) can call panTo/setZoom on it.
function MapRefBridge({ mapRef }) {
  const map = useMap();
  mapRef.current = map;
  return null;
}

export default function CivicMap({
  center,
  userLocation,
  issues,
  selectedIssue,
  onSelectIssue,
  onRecenter,
}) {
  const mapRef = useRef(null);
  const [initialCenter] = useState([center.lat, center.lng]);

  const recenter = useCallback(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    }
    onRecenter?.();
  }, [userLocation, onRecenter]);

  const markers = useMemo(() => {
    return (issues || [])
      .map((issue) => ({ issue, position: toLatLng(issue) }))
      .filter((m) => m.position);
  }, [issues]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        keyboard
        zoomControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        <MapRefBridge mapRef={mapRef} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationDivIcon()}
            zIndexOffset={999}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {markers.map(({ issue, position }) => (
          <Marker
            key={issue._id}
            position={[position.lat, position.lng]}
            icon={issueDivIcon(issue, selectedIssue?._id === issue._id)}
            zIndexOffset={selectedIssue?._id === issue._id ? 998 : 0}
            eventHandlers={{ click: () => onSelectIssue(issue) }}
          >
            <Popup>
              <span className="font-semibold">{getIssueTitle(issue)}</span>
              {issue.location?.address ? <><br />{issue.location.address}</> : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button
        type="button"
        onClick={recenter}
        className="absolute bottom-4 left-4 z-[400] bg-white shadow-md border border-slate-200 rounded-full px-3 py-2 text-[11px] font-bold text-teal-700 hover:bg-teal-50 transition-all cursor-pointer"
      >
        Recenter on me
      </button>
    </div>
  );
}
