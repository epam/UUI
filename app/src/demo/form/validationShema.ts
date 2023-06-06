import { Metadata } from '@epam/uui-core';
import { PersonDetails } from './types';
import dayjs from 'dayjs';

const fullNameRegExp = /^[a-zA-Z0-9\s'-]+$/;

export const personDetailsSchema = (value: PersonDetails): Metadata<PersonDetails> => ({
    props: {
        personalInfo: {
            props: {
                fullName: {
                    isRequired: true,
                    validators: [(value: string) => [!fullNameRegExp.exec(value)?.length && 'Full Name should contain only Latin alphabet characters and numbers!']],
                },
                birthdayDate: {
                    isRequired: true,
                    validators: [(value: string) => [!(dayjs(value).valueOf() <= dayjs().subtract(16, 'year').valueOf()) && 'User cannot be under 16 years old!']],
                },
            },
        },
        location: {
            props: {
                country: { isRequired: true },
                city: {
                    isRequired: true,
                    isDisabled: !value.location?.country,
                },
            },
        },
        primaryInfo: {
            isDisabled: value.role !== 'Admin',
        },
        education: {
            props: {
                institution: { isRequired: false },
                faculty: { isRequired: false },
                department: { isRequired: false },
                degree: { isRequired: false },
                speciality: { isRequired: false },
                graduationYear: {
                    isRequired: false,
                    validators: [(value: number | null) => [value !== null && value < 1950 && 'The year of graduation can not be less than 1950!']],
                },
            },
        },
        languageInfo: {
            all: {
                props: {
                    language: { isRequired: false },
                    speakingLevel: { isRequired: false },
                    writingLevel: { isRequired: false },
                },
            },
        },
        travelVisas: {
            props: {
                visas: {
                    all: {
                        props: {
                            country: { isRequired: false },
                            term: {
                                props: {
                                    from: {
                                        isRequired: false,
                                    },
                                    to: {
                                        isRequired: false,
                                    },
                                },
                            },
                        },
                    },
                },
                scans: {
                    all: {
                        props: {
                            progress: { isRequired: false },
                            id: { isRequired: false },
                            name: { isRequired: false },
                            size: { isRequired: false },
                            path: { isRequired: false },
                            type: { isRequired: false },
                            extension: { isRequired: false },
                        },
                    },
                },
            },
        },
        otherInfo: {
            props: {
                tShirtSize: { isRequired: false },
            },
        },
    },
});
