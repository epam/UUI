import { PersonDetails } from '../models';

export const personDetails: PersonDetails = {
    sex: 'male',
    birthdayDate: '02-11-1989',
    firstName: 'John',
    middleName: 'F',
    lastName: 'Smith',
    countryId: 'RU',
    experience: [
        {
            experienceName: 'MIT',
            startRange: '2006',
            endRange: '2011',
        }, {
            experienceName: 'EPAM',
            startRange: '2012',
            endRange: '2018',
        },
    ],
    vacDays: 30,
    rangeDateValue: { from: '2018-10-29', to: '2018-11-17' },
    bracket: { from: 10, to: 1500 },
    timeValue: {
        hours: 11,
        minutes: 50,
    },
    rating: 5,
    roles: ['Admin'],
    notes: 'John is an great professional.',
    attachments: [],
};
