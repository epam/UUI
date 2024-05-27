import { AsyncDataSource } from '@epam/uui-core';

const euLocations = {
    items: [
        {
            id: 'germany',
            name: 'Germany',
            parentId: null,
        },
        {
            id: 'berlin',
            name: 'Berlin',
            parentId: 'germany',
        },
        {
            id: 'munich',
            name: 'Munich',
            parentId: 'germany',
        },
        {
            id: 'france',
            name: 'France',
            parentId: null,
        },
        {
            id: 'paris',
            name: 'Paris',
            parentId: 'france',
        },
        {
            id: 'lyon',
            name: 'Lyon',
            parentId: 'france',
        },
        {
            id: 'italy',
            name: 'Italy',
            parentId: null,
        },
        {
            id: 'rome',
            name: 'Rome',
            parentId: 'italy',
        },
        {
            id: 'milan',
            name: 'Milan',
            parentId: 'italy',
        },
        {
            id: 'spain',
            name: 'Spain',
            parentId: null,
        },
        {
            id: 'madrid',
            name: 'Madrid',
            parentId: 'spain',
        },
        {
            id: 'barcelona',
            name: 'Barcelona',
            parentId: 'spain',
        },
        {
            id: 'portugal',
            name: 'Portugal',
            parentId: null,
        },
        {
            id: 'lisbon',
            name: 'Lisbon',
            parentId: 'portugal',
        },
        {
            id: 'porto',
            name: 'Porto',
            parentId: 'portugal',
        },
        {
            id: 'netherlands',
            name: 'Netherlands',
            parentId: null,
        },
        {
            id: 'amsterdam',
            name: 'Amsterdam',
            parentId: 'netherlands',
        },
        {
            id: 'rotterdam',
            name: 'Rotterdam',
            parentId: 'netherlands',
        },
        {
            id: 'belgium',
            name: 'Belgium',
            parentId: null,
        },
        {
            id: 'brussels',
            name: 'Brussels',
            parentId: 'belgium',
        },
        {
            id: 'antwerp',
            name: 'Antwerp',
            parentId: 'belgium',
        },
        {
            id: 'austria',
            name: 'Austria',
            parentId: null,
        },
        {
            id: 'vienna',
            name: 'Vienna',
            parentId: 'austria',
        },
        {
            id: 'salzburg',
            name: 'Salzburg',
            parentId: 'austria',
        },
    ],
};

export const euLocationsDs = new AsyncDataSource({
    api: () => Promise.resolve(euLocations.items),
    getId: (i) => i.id,
    getParentId: (i) => i.parentId,
});
