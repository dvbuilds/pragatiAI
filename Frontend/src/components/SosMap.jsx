import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { sosServiceDivIcon, userLocationDivIcon } from '../lib/leafletIcons';
import { CATEGORY_BY_KEY, formatDistance } from '../lib/emergency';
import { useLanguage } from '../i18n/LanguageContext';

// Re-frames the map whenever the search origin or result set changes, and
// pans to a service when the user picks one from the list.
function MapController({ origin, services, selected }) {
  const map = useMap();

  useEffect(() => {
    const points = [[origin.lat, origin.lng], ...services.map((s) => [s.lat, s.lng])];
    if (points.length === 1) {
      map.setView(points[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
    }
  }, [map, origin.lat, origin.lng, services]);

  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 15), { duration: 0.5 });
  }, [map, selected]);

  return null;
}

export default function SosMap({ origin, services, radiusKm, selectedId, onSelect }) {
  const { t } = useLanguage();
  const selected = services.find((s) => s.id === selectedId) || null;

  return (
    <MapContainer
      center={[origin.lat, origin.lng]}
      zoom={14}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <MapController origin={origin} services={services} selected={selected} />

      <Circle
        center={[origin.lat, origin.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: '#dc2626', weight: 1, fillOpacity: 0.04, dashArray: '4 6' }}
        interactive={false}
      />

      <Marker position={[origin.lat, origin.lng]} icon={userLocationDivIcon()} zIndexOffset={1000}>
        <Popup>{origin.label || t('sos.map.you')}</Popup>
      </Marker>

      {services.map((s) => {
        const cat = CATEGORY_BY_KEY[s.category];
        const active = s.id === selectedId;
        return (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={sosServiceDivIcon(cat?.color || '#475569', cat?.glyph || '?', active)}
            zIndexOffset={active ? 999 : 0}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup>
              <span className="font-semibold">{s.name}</span>
              <br />
              {cat ? t(cat.labelKey) : s.categoryLabel} · {formatDistance(s.distanceMeters)}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
