import { FileUploadResponse } from '@epam/uui-core';
import { TimePickerValue } from '@epam/uui';

export interface Person {
    __typename: 'Person';
    id: number;
    uid: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    modifiedDate: string;
    avatarUrl: string;
    birthDate?: Date;
    departmentId: number;
    departmentName: string;
    hireDate?: Date;
    jobTitleId?: number;
    jobTitle?: string;
    titleLevel?: string;
    productionCategory?: boolean;
    notes?: string;
    countryId?: string;
    countryName?: string;
    cityId?: number;
    cityName?: string;
    locationId: number | string;
    locationName: string;
    profileStatusId?: number;
    profileStatus?: string;
    officeId?: number;
    officeAddress?: string;
    managerId?: number;
    managerName?: string;
    primarySkillId?: string;
    primarySkill?: string;
    relatedNPR?: boolean;
}

export interface PersonEmploymentGroup {
    __typename: 'PersonEmploymentGroup';
    id: number;
    name: string;
    count: number;
    groupBy: string;
    jobTitleId?: number;
    departmentId?: number;
}

export interface Department {
    __typename: 'Department';
    id: number;
    name: string;
}

export interface Company {
    __typename: 'Company';
    id: number;
    name: string;
}

export interface JobTitle {
    __typename: 'JobTitle';
    id: number;
    name: string;
}

export interface Status {
    __typename: 'Status';
    id: number;
    name: string;
}

export interface Manager {
    __typename: 'Manager';
    id: number;
    name: string;
}

export interface Office {
    __typename: 'Office';
    id: number;
    name: string;
}

export interface Store {
    BusinessEntityID: number;
    Name: string;
    SalesPersonID: number;
    ModifiedDate: string;
}

export interface Product {
    ProductID: number;
    Name: string;
    ProductNumber: string;
    MakeFlag: boolean;
    FinishedGoodsFlag: boolean;
    Color: string;
    SafetyStockLevel: number;
    ReorderPoint: number;
    StandardCost: number;
    ListPrice: number;
    Size?: string;
    SizeUnitMeasureCode?: 'CM';
    WeightUnitMeasureCode?: 'LB ' | 'G ';
    Weight?: number;
    DaysToManufacture: number;
    ProductLine?: 'R ' | 'M ' | 'T ' | 'S ';
    Class?: string;
    Style?: string;
    ProductSubcategoryID?: number;
    ProductModelID?: number;
    SellStartDate: string;
    DiscontinuedDate?: string;
    ModifiedDate: string;
}

export interface SalesPerson {
    BusinessEntityID: number;
    TerritoryID?: number;
    SalesQuota?: number;
    Bonus: number;
    CommissionPct: number;
    SalesYTD: number;
    SalesLastYear: number;
    ModifiedDate: string;
}

/* Geo Data */

export interface City {
    id: string;
    name: string;
    asciiname: string;
    alternativeNames: string[];
    lat: string;
    lon: string;
    featureClass: string;
    featureCode: string;
    country: string;
    countryName?: string;
    altCountry: string;
    adminCode: string;
    countrySubdivision: string;
    municipality: string;
    municipalitySubdivision: string;
    population: string;
    elevation: string;
    dem: string;
    tz: string;
    lastModified: string;

    /* Fields for editor demo, does not exists in demo data */
    founded?: string;
    area?: number;
    notes?: string;
}

export interface District {
    id: string;
    cityId: string;
    name: string;
    population: number;
}

export interface Continent {
    id: string;
    name: string;
}

export interface Country {
    id: string;
    name: string;
    native: string;
    phone: string;
    continent: string;
    capital: string;
    currency: string;
    languages: string[];
}

export interface Language {
    id: string;
    name: string;
    native: string;
}

export interface Location {
    __typename: 'Location';
    id: string;
    name: string;
    type: 'city' | 'country' | 'continent';
    parentId?: string;
    asciiname?: string;
    alternativeNames?: string[];
    lat?: string;
    lon?: string;
    featureClass?: string;
    featureCode?: string;
    country?: string;
    countryName?: string;
    altCountry?: string;
    adminCode?: string;
    countrySubdivision?: string;
    municipality?: string;
    municipalitySubdivision?: string;
    population?: string;
    elevation?: string;
    dem?: string;
    tz?: string;
    lastModified?: string;
    childCount: number;
}

export interface FeatureClass {
    id: string;
    name: string;
    description?: string;
    order?: string;
}

export interface LanguageLevel {
    id: number;
    level: string;
}

export interface PersonSchedule {
    email: string;
    events: {
        'startDate': number;
        'endDate': number;
        'eventType': string;
        'status': string;
    }[];
}

export interface PersonExperienceItem {
    experienceName?: string;
    rangeDateValue?: { from: string, to: string };
    startRange?: string;
    endRange?: string;
}

export interface PersonDetails {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    countryId?: number | string;
    countries?: number[];
    city?: any;
    birthdayDate?: string;
    experience?: PersonExperienceItem[];
    sex?: string;
    vacDays?: number;
    roles?: string[];
    skill?: number;
    bracket?: { from: number, to: number };
    rangeDateValue?: { from: string, to: string };
    notes?: string;
    numberValue?: number;
    timeValue?: TimePickerValue;
    rating?: number;
    attachments?: ({ progress?: number } & FileUploadResponse)[];

}
