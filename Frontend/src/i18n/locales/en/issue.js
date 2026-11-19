// Issue wizard, issue type names, status labels, titles and relative times.
// Use as t('issue.<key>'). Issue type / status keys are looked up by the
// backend enum value, so every variant must stay defined.
export default {
  // Issue type titles (keyed by backend `type`)
  'type.pothole': 'Pothole Report',
  'type.lighting': 'Streetlight Issue',
  'type.sanitation': 'Sanitation Report',
  'type.noise': 'Noise Complaint',
  'type.other': 'Civic Report',

  // Issue status labels (keyed by backend `status`)
  'status.active': 'Active',
  'status.in_review': 'In Review',
  'status.resolved': 'Resolved',

  // Relative times (everything past 'just now' uses Intl.RelativeTimeFormat)
  'time.justNow': 'Just now',

  // Wizard: header
  'wizard.title': 'Report a New Issue',
  'wizard.subtitle': 'AI-Assisted Dispatch Center',

  // Wizard: validation alerts and errors
  'wizard.error.describe': "Please describe what's happening.",
  'wizard.error.pinLocation': 'Please pin the issue location on the map.',
  'wizard.error.submitFailed': 'Could not submit your report. Please try again.',

  // Wizard: step 1 (describe)
  'wizard.ai.title': 'AI Smart Categorization',
  'wizard.ai.body': "Describe what's happening and, optionally, attach a photo. Our AI will automatically determine the category, identify the department, and assign dispatch priority once you submit.",
  'wizard.photo.prompt': 'Drop a photo here, or click to browse',
  'wizard.photo.hint': 'Optional — helps the crew assess the issue faster',
  'wizard.description.label': 'Describe the issue',
  'wizard.description.placeholder': 'Example: Large pothole appearing near the intersection of 4th and Main. It is causing cars to swerve...',
  'wizard.suggest.label': 'Quick suggests:',
  'wizard.suggest.streetlight.button': '💡 Blinking Streetlight',
  'wizard.suggest.streetlight.text': 'Streetlight is blinking repeatedly, causing it to be pitch black at night.',
  'wizard.suggest.pothole.button': '🚗 Deep Pothole',
  'wizard.suggest.pothole.text': 'Large deep pothole in the left-bound lane. Multiple cars swerving.',

  // Wizard: step 2 (locate)
  'wizard.locate.title': 'Pin the exact location',
  'wizard.locate.body': 'Tap the map to drop a pin, drag it to fine-tune, or use your current location.',

  // Wizard: step 3 (review)
  'wizard.submitting.title': 'Dispatching to CivicPulse AI...',
  'wizard.submitting.body': 'Analyzing your description and matching it with the right municipal department.',
  'wizard.review.description': 'Citizen Description',
  'wizard.review.location': 'Pinned Location',
  'wizard.review.photo': 'Attached Photo',
  'wizard.review.note': 'Click "Confirm & Dispatch" to submit — AI classification runs on the server.',

  // Wizard: step 4 (done)
  'wizard.done.title': 'Issue Logged & Dispatched',
  'wizard.done.body': 'Thank you! The {department} has been notified. A crew is scheduled to investigate.',
  'wizard.done.category': 'Category',
  'wizard.done.priority': 'Priority',
  'wizard.done.backToPortal': 'Back to Portal',

  // Wizard: footer buttons
  'wizard.button.cancel': 'Cancel',
  'wizard.button.back': 'Back',
  'wizard.button.toLocation': 'Continue to Location',
  'wizard.button.toReview': 'Review & Submit',
  'wizard.button.submit': 'Confirm & Dispatch',
};
