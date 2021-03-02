import { Metadata } from '@epam/uui';
import { PersonDetails } from './types';

const fullNameRegExp = /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/;
const emailRegExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const phoneNumberRegExp = /^(\+)?(\(\d{2,3}\) ?\d|\d)(([ \-]?\d)|( ?\(\d{2,3}\) ?)){5,12}\d$/;

export const personDetailsSchema = (value: PersonDetails): Metadata<PersonDetails> => ({
    props: {
        personalInfo: {
            props: {
                fullName: {
                    isRequired: true,
                    validators: [
                        (value: string) => [!fullNameRegExp.exec(value)?.length && 'Please type correct name!'],
                    ],
                },
                birthdayDate: { isRequired: true },
                sex: { isRequired: true },
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
        contacts: {
            props: {
                email: {
                    isRequired: true,
                    validators: [
                        (value: string) => [!emailRegExp.exec(value)?.length && 'Email is not valid!'],
                    ],
                },
                phoneNumber: {
                    isRequired: true,
                    validators: [
                        (value: string) => [!phoneNumberRegExp.exec(value)?.length && 'Phone number is not valid!'],
                    ],
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
        militaryService: {
            props: {
                hasMilitaryId: { isRequired: false },
                servedInTheArmy: { isRequired: false },
                eligibleToServeTheArmy: { isRequired: false },
                otherMilitaryInfo: { isRequired: false },
            },
        },
        otherInfo: {
            props: {
                tShirtSize: { isRequired: false },
            },
        },
    },
});