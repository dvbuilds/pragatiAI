// Official portal links for common Indian civic documents, used to ground the
// AI document-guidance feature with a real, verifiable link.
const documentLinks = {
  aadhaar: 'https://uidai.gov.in/',
  pan_card: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
  voter_id: 'https://voters.eci.gov.in/',
  passport: 'https://www.passportindia.gov.in/',
  driving_license: 'https://parivahan.gov.in/',
  ration_card: 'https://food.wb.gov.in/', // West Bengal default; swap per state if needed
  birth_certificate: 'https://crsorgi.gov.in/',
  income_certificate: 'https://wbpublicservicecommission.gov.in/', // varies by state, kept as WB default
  caste_certificate: 'https://castecertificatewb.gov.in/',
  domicile_certificate: 'https://edistrict.wb.gov.in/',
  property_tax_document: 'https://www.kmcgov.in/',
};

export const resolveOfficialLink = (documentName) => {
  const key = documentName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z_]/g, '');
  return documentLinks[key] || null;
};

export default documentLinks;
