// Reference list used to ground the AI scheme-matching feature so it can only
// recommend real schemes with real links, rather than inventing names.
// Extend this list as needed.
const schemes = [
  {
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    eligibility: 'Small and marginal farmer families',
    officialLink: 'https://pmkisan.gov.in/',
  },
  {
    name: 'Ayushman Bharat - PM Jan Arogya Yojana (PMJAY)',
    eligibility: 'Economically vulnerable families (per SECC database), health insurance cover',
    officialLink: 'https://pmjay.gov.in/',
  },
  {
    name: 'Pradhan Mantri Awas Yojana (PMAY)',
    eligibility: 'Low and middle income households without a pucca house',
    officialLink: 'https://pmaymis.gov.in/',
  },
  {
    name: 'National Scholarship Portal (NSP) schemes',
    eligibility: 'Students from economically weaker sections, pre/post-matric',
    officialLink: 'https://scholarships.gov.in/',
  },
  {
    name: 'Sukanya Samriddhi Yojana',
    eligibility: 'Parents/guardians of a girl child under 10 years',
    officialLink: 'https://www.india.gov.in/spotlight/sukanya-samriddhi-yojana',
  },
  {
    name: 'Pradhan Mantri Employment Generation Programme (PMEGP)',
    eligibility: 'Adults 18+ setting up micro-enterprises, self-employment',
    officialLink: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
  },
  {
    name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
    eligibility: 'Women from BPL households, free LPG connection',
    officialLink: 'https://www.pmuy.gov.in/',
  },
  {
    name: 'Atal Pension Yojana',
    eligibility: 'Unorganised sector workers aged 18-40',
    officialLink: 'https://npscra.nsdl.co.in/scheme-details.php',
  },
  {
    name: 'National Old Age Pension Scheme (IGNOAPS)',
    eligibility: 'BPL citizens aged 60+',
    officialLink: 'https://nsap.nic.in/',
  },
  {
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    eligibility: 'SC/ST/OBC students in post-matriculation courses, income-based',
    officialLink: 'https://scholarships.gov.in/',
  },
  {
    name: 'Stand-Up India Scheme',
    eligibility: 'Women entrepreneurs and SC/ST entrepreneurs, bank loans for new enterprises',
    officialLink: 'https://www.standupmitra.in/',
  },
  {
    name: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)',
    eligibility: 'Pregnant and lactating women, cash incentive for first live birth',
    officialLink: 'https://pmmvy.wcd.gov.in/',
  },
  {
    name: 'West Bengal Kanyashree Prakalpa',
    eligibility: 'Unmarried girls aged 13-18 in West Bengal from low-income families',
    officialLink: 'https://wbkanyashree.gov.in/',
  },
  {
    name: 'West Bengal Swasthya Sathi',
    eligibility: 'All West Bengal residents, health insurance cover',
    officialLink: 'https://swasthyasathi.gov.in/',
  },
  {
    name: 'Unemployment Allowance / Yuvashree (West Bengal)',
    eligibility: 'Unemployed youth aged 18-45 registered with Employment Bank, West Bengal',
    officialLink: 'https://employmentbankwb.gov.in/',
  },
];

export default schemes;
