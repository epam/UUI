import { Metadata } from '@epam/uui-core';
import { PersonDetails } from '../models/types';

const fullNameRegExp = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/;

export const personDetailsSchema = (
    value: PersonDetails
): Metadata<PersonDetails> => ({
    props: {
        personalInfo: {
            props: {
                fullName: {
                    isRequired: true,
                    validators: [
                        (value: string = '') => [
                            !fullNameRegExp.exec(value)?.length &&
                                'Please type correct name!',
                        ],
                    ],
                },
                birthdayDate: { isRequired: true },
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
                graduationYear: { isRequired: false },
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
