import { useState, useEffect, useCallback } from 'react';

// Kolkata fallback — used if the browser denies/lacks geolocation so the
// map still centers somewhere sensible instead of on (0,0).
const DEFAULT_LOCATION = { lat: 22.5726, lng: 88.3639 };

/**
 * Resolves the user's current browser location.
 * Returns { location, status, error, refresh } where status is one of
 * 'idle' | 'locating' | 'success' | 'denied' | 'unsupported' | 'error'.
 */
export default function useGeolocation() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isDefault, setIsDefault] = useState(true);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError('Your browser does not support geolocation.');
      setLocation(DEFAULT_LOCATION);
      setIsDefault(true);
      return;
    }

    setStatus('locating');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsDefault(false);
        setStatus('success');
      },
      (err) => {
        setLocation(DEFAULT_LOCATION);
        setIsDefault(true);
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setError('Location access was denied. Showing Kolkata by default.');
        } else {
          setStatus('error');
          setError('Could not determine your location. Showing Kolkata by default.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  return { location, status, error, isDefault, refresh: locate, defaultLocation: DEFAULT_LOCATION };
}
