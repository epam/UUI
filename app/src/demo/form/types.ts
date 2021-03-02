import { FileUploadResponse } from '@epam/uui';

export interface PersonalInfo {
    fullName?: string;
    birthdayDate?: string;
    sex?: string;
}

export interface PersonLocation {
    country?: string;
    city?: string;
}

export interface PersonContacts {
    phoneNumber?: string;
    email?: string;
}

export interface PersonPrimaryInfo {
    status?: string;
    productionCategory?: string;
    organizationalCategory?: string;
    jobFunction?: string;
    jobFunctionLevel?: string;
    currentProject?: string;
    projectRole?: string;
    timeReporting?: boolean;
    remoteStatus?: boolean;
}

export interface PersonEducation {
    institution?: string;
    faculty?: string;
    department?: string;
    degree?: string;
    speciality?: string;
    graduationYear?: number;
}

export interface PersonLanguageInfo {
    language?: string;
    speakingLevel?: string;
    writingLevel?: string;
}

export interface PersonTravelVisa {
    country?: string;
    term?: { from: string, to: string };
}

export interface PersonTravelVisas {
    visas: PersonTravelVisa[];
    scans: ({ progress?: number } & Partial<FileUploadResponse>)[];
}

export interface PersonMilitaryService {
    hasMilitaryId?: boolean;
    servedInTheArmy?: boolean;
    eligibleToServeTheArmy?: boolean;
    otherMilitaryInfo?: string;
}

export interface PersonOtherInfo {
    tShirtSize: number;
}

export interface PersonDetails {
    role?: 'Admin' | 'User';
    personalInfo?: PersonalInfo;
    location?: PersonLocation;
    contacts?: PersonContacts;
    primaryInfo?: PersonPrimaryInfo;
    education?: PersonEducation;
    languageInfo?: PersonLanguageInfo[];
    travelVisas?: PersonTravelVisas;
    militaryService?: PersonMilitaryService;
    otherInfo?: PersonOtherInfo;
}