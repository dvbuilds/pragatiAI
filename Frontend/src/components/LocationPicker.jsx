import { useCallback, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LocateFixed, MapPin } from 'lucide-react';
import { pickerDivIcon } from '../lib/leafletIcons';

/**
 * Reverse-geocodes a lat/lng into a human-readable address using
 * OpenStreetMap's free Nominatim API. No API key required. Nominatim asks
 * that requests be lightweight and not hammered, so this is only called
 * once per pin placement (on click/drag end), not on every map move.
 */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&addressdetails=0`,
      { headers: { Accept: 'application/json' } }
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data?.display_name || '';
  } catch {
    return '';
  }
}

// Clicking anywhere on the map drops/moves the pin there.
function ClickToPlace({ onPlace }) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Leaflet-based location picker for the "report an issue" flow.
 * Renders a draggable pin the citizen can drop on their exact issue
 * location; also supports click-to-place and a "use my location" button.
 *
 * Props:
 *   value: { lat, lng } | null  — current picked position
 *   defaultCenter: { lat, lng } — where to center the map initially
 *   onChange: ({ lat, lng, address }) => void
 */
export default function LocationPicker({ value, defaultCenter, onChange }) {
  const [position, setPosition] = useState(value || null);
  const [address, setAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const markerRef = useRef(null);

  const commitPosition = useCallback(async (lat, lng) => {
    setPosition({ lat, lng });
    setIsResolvingAddress(true);
    const resolvedAddress = await reverseGeocode(lat, lng);
    setAddress(resolvedAddress);
    setIsResolvingAddress(false);
    onChange({ lat, lng, address: resolvedAddress });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    if (!('geolocation' in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        commitPosition(pos.coords.latitude, pos.coords.longitude);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker) {
        const { lat, lng } = marker.getLatLng();
        commitPosition(lat, lng);
      }
    },
  };

  const center = position || defaultCenter;

  return (
    <div className="space-y-3">
      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={15}
          scrollWheelZoom
          dragging
          doubleClickZoom
          touchZoom
          keyboard
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickToPlace onPlace={commitPosition} />
          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={pickerDivIcon()}
              draggable
              eventHandlers={eventHandlers}
              ref={markerRef}
            />
          )}
        </MapContainer>

        <button
          type="button"
          onClick={useMyLocation}
          disabled={isLocating}
          className="absolute bottom-3 right-3 z-[400] bg-white shadow-md border border-slate-200 rounded-full px-3 py-2 text-[11px] font-bold text-teal-700 hover:bg-teal-50 transition-all flex items-center gap-1.5 disabled:opacity-60"
        >
          <LocateFixed className="w-3.5 h-3.5" />
          {isLocating ? 'Locating...' : 'Use my location'}
        </button>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl p-3">
        <MapPin className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
        {!position && <span>Tap the map to drop a pin at the issue location, or use your current location.</span>}
        {position && (
          <span>
            {isResolvingAddress ? 'Looking up address...' : (address || `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`)}
          </span>
        )}
      </div>
    </div>
  );
}
