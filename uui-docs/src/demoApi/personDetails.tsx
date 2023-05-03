import { personDetails } from '../demoData/personDetails';
import { PersonDetails } from '../models';

function randomDelay<T>(result: T): Promise<T> {
    return new Promise<T>((resolve) => {
        setTimeout(() => resolve(result), Math.random() * 1000 + 20);
    });
}

export const personDetailsApi = {
    load: () => {
        let details = personDetails;
        const localStorageJson = localStorage?.getItem('person-details');
        if (localStorageJson) {
            details = JSON.parse(localStorageJson);
        }
        return randomDelay(details);
    },
    loadDefault: () => {
        const details = personDetails;

        return randomDelay(details);
    },
    save: (details: PersonDetails) => {
        localStorage.setItem('person-details', JSON.stringify(details));
        return randomDelay(details);
    },
};
