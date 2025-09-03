import { PersonDetails, PersonLanguageInfo, PersonTravelVisa } from './types';

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
    personalInfo: {
        fullName: '',
        birthdayDate: undefined,
    },
    location: {
        city: undefined,
        country: undefined,
    },
};

export const emptyInfo = {
    language: {
        language: null,
        writingLevel: null,
        speakingLevel: null,
    } as PersonLanguageInfo,
    visa: {
        country: null,
        term: null,
    } as PersonTravelVisa,
};
