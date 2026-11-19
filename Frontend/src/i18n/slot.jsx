import React from 'react';

/**
 * Put a styled node (bold text, a link) inside a translated sentence without
 * splitting the sentence across keys — translators decide where {slot} goes.
 *
 *   withSlot(translate(key, { name: SLOT }), <strong>{value}</strong>)
 */
export const SLOT = '\u0001';

export function withSlot(template, node) {
  const [before, after = ''] = template.split(SLOT);
  return <>{before}{node}{after}</>;
}
