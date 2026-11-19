// Public Portal page, civic map, location picker and geolocation messages.
// Use as t('portal.<key>').
export default {
  // Top bar
  'topbar.breadcrumb.section': 'Public Portal',
  'topbar.breadcrumb.page': 'Community Watch',
  'topbar.newRequest': 'New Request',

  // Page header
  'header.title': 'Community Watch',
  'header.subtitle': 'Transparent reporting for a better neighborhood. Use our AI-powered portal to report infrastructure issues instantly.',
  'stats.loading': 'Loading stats...',
  'stats.fixedOne': '1 Issue Fixed This Week',
  'stats.fixedOther': '{count} Issues Fixed This Week',

  // Map search and filters
  'search.placeholder': 'Search neighborhood...',
  'filter.all': 'All Issues',
  'filter.pothole': 'Potholes',
  'filter.lighting': 'Lighting',
  'filter.sanitation': 'Sanitation',

  // Status banner
  'banner.locating': 'Finding your location...',
  'banner.defaultLocation': 'Showing Kolkata (default location).',
  'banner.retry': 'Retry',
  'errors.loadNearby': 'Could not load nearby reports. Is the backend running?',

  // Map overlays
  'map.loadingReports': 'Loading nearby reports...',
  'map.noReports': 'No reports found within {radius}km',

  // Selected issue card
  'selected.resolved': 'Resolved Issue',
  'selected.active': 'Active Issue',
  'selected.reported': 'Reported {time}.',
  'selected.priority': '{priority} Priority',

  // Neighborhood insight
  'insight.title': 'Neighborhood Insight',
  'insight.loading': 'Crunching nearby reports...',
  'insight.empty': 'No reports within {radius}km yet — be the first to file one.',
  'insight.summaryOne': '1 report within {radius}km, {resolved} already resolved.',
  'insight.summaryOther': '{total} reports within {radius}km, {resolved} already resolved.',
  'insight.topType': 'The most common issue nearby is {type}.',
  'insight.source': 'Live from CivicPulse reports',

  // Recently resolved feed
  'resolved.title': 'Recently Resolved',
  'resolved.loading': 'Loading recent activity...',
  'resolved.empty': 'No resolved reports yet.',
  'resolved.badge': 'Fixed',

  // Footer
  'footer.tagline': 'Empowering citizens through intelligent digital infrastructure and transparent governance.',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'footer.accessibility': 'Accessibility Standard',
  'footer.contact': 'Contact Support',
  'footer.copyright': '© 2026 Digital Government Services. All rights reserved. Powered by CivicPulse AI.',

  // Civic map
  'civicMap.youAreHere': 'You are here',
  'civicMap.recenter': 'Recenter on me',

  // Location picker
  'picker.locating': 'Locating...',
  'picker.useMyLocation': 'Use my location',
  'picker.hint': 'Tap the map to drop a pin at the issue location, or use your current location.',
  'picker.lookingUp': 'Looking up address...',

  // Geolocation messages
  'geo.unsupported': 'Your browser does not support geolocation.',
  'geo.denied': 'Location access was denied. Showing Kolkata by default.',
  'geo.error': 'Could not determine your location. Showing Kolkata by default.',
};
