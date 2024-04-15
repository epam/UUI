import {
  PersonDetails,
  PersonLanguageInfo,
  PersonTravelVisa,
} from './models/types';

export const defaultData: PersonDetails = {
  role: 'User',
  primaryInfo: {
    status: 'Full-time employee',
    productionCategory: 'Production',
    organizationalCategory: 'Strategy & Design',
    jobFunction: 'Design',
    jobFunctionLevel: 'Level 2',
    currentProject: 'EPM-UUI',
    projectRole: 'Key Designer',
    timeReporting: true,
    remoteStatus: true,
  },
  personalInfo: {},
  location: { country: '', city: '' },
  education: {},
  languageInfo: [],
  travelVisas: { visas: [], scans: [] },
  otherInfo: { tShirtSize: 0 },
};

export const emptyInfo = {
  language: {
    language: '',
    writingLevel: '',
    speakingLevel: '',
  } as PersonLanguageInfo,
  visa: {
    country: '',
    term: {},
  } as PersonTravelVisa,
};
