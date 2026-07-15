import L from 'leaflet';

/**
 * Leaflet needs marker image assets, and the default ones break under
 * Vite/webpack bundling (the paths it looks for don't match the hashed
 * build output). Instead of fighting that, every marker here is a small
 * inline SVG built with L.divIcon — no external image files, nothing to
 * misconfigure, and it matches the app's own color palette.
 */

const TYPE_STYLE = {
  pothole: { color: '#d97706', label: 'P' },
  lighting: { color: '#0f766e', label: 'L' },
  sanitation: { color: '#e11d48', label: 'S' },
  noise: { color: '#7c3aed', label: 'N' },
  other: { color: '#475569', label: 'C' },
};
const RESOLVED_STYLE = { color: '#059669', label: '\u2713' };

function pinSvg(color, label, size) {
  return `
    <svg width="${size}" height="${size * 1.5}" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" style="display:block; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="7" fill="#ffffff"/>
      <text x="12" y="16.5" font-size="10" font-weight="700" text-anchor="middle" fill="${color}" font-family="Inter, ui-sans-serif, sans-serif">${label}</text>
    </svg>
  `;
}

/**
 * Teardrop pin for an issue, tip-anchored so the point of the pin — not
 * its center — marks the exact reported coordinate. Sized up slightly
 * when selected/active.
 */
export function issueDivIcon(issue, isActive) {
  const style = issue.status === 'resolved' ? RESOLVED_STYLE : (TYPE_STYLE[issue.type] || TYPE_STYLE.other);
  const size = isActive ? 34 : 28;
  return L.divIcon({
    html: pinSvg(style.color, style.label, size),
    className: 'civicpulse-marker',
    iconSize: [size, size * 1.5],
    iconAnchor: [size / 2, size * 1.5],
    popupAnchor: [0, -size * 1.4],
  });
}

/** Solid blue dot for "you are here". */
export function userLocationDivIcon() {
  return L.divIcon({
    html: `
      <div style="
        width: 18px; height: 18px; border-radius: 9999px;
        background: #2563eb; border: 3px solid #ffffff;
        box-shadow: 0 0 0 2px rgba(37,99,235,0.35);
      "></div>
    `,
    className: 'civicpulse-marker',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

/** Larger draggable teal pin used in the report-a-new-issue location picker. */
export function pickerDivIcon() {
  const size = 40;
  return L.divIcon({
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" style="display:block; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z" fill="#0c9488"/>
        <circle cx="12" cy="12" r="5" fill="#ffffff"/>
      </svg>
    `,
    className: 'civicpulse-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}
