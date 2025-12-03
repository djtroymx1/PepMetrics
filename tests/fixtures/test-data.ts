/**
 * Test data for PepMetrics E2E tests
 * User: Troy
 */

export const testUser = {
  name: 'Troy',
  email: 'troy@example.com',
  membership: 'Pro Member',
};

export const peptides = [
  {
    name: 'Retatrutide',
    dosage: '2mg',
    frequency: 'weekly',
    route: 'subcutaneous',
  },
  {
    name: 'BPC-157',
    dosage: '250mcg',
    frequency: 'twice daily',
    route: 'subcutaneous',
  },
  {
    name: 'MOTS-c',
    dosage: '5mg',
    frequency: 'daily',
    route: 'subcutaneous',
  },
  {
    name: 'TB-500',
    dosage: '2.5mg',
    frequency: 'twice weekly',
    route: 'subcutaneous',
  },
  {
    name: 'Tesamorelin',
    dosage: '2mg',
    frequency: 'daily',
    route: 'subcutaneous',
  },
  {
    name: 'Epithalon',
    dosage: '5mg',
    frequency: 'daily for 10 days',
    route: 'subcutaneous',
  },
  {
    name: 'GHK-Cu',
    dosage: '1mg',
    frequency: 'daily',
    route: 'subcutaneous',
  },
  {
    name: 'SS-31',
    dosage: '5mg',
    frequency: 'daily',
    route: 'subcutaneous',
  },
];

export const healthMetrics = {
  steps: 8200,
  sleepScore: 87,
  hrv: 62,
  stress: 32,
  activeMinutes: 42,
  calories: 2340,
};

export const routes = {
  dashboard: '/',
  protocols: '/protocols',
  health: '/health',
  progress: '/progress',
  calendar: '/calendar',
  insights: '/insights',
  bloodwork: '/bloodwork',
  settings: '/settings',
};

export const pageHeadings = {
  dashboard: 'Good morning, Troy',
  protocols: 'Protocol Management',
  health: 'Health Metrics',
  progress: 'Progress',
  calendar: 'Calendar',
  insights: 'Insights',
  bloodwork: 'Bloodwork',
  settings: 'Settings',
};
