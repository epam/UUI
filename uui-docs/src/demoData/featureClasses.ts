import { FeatureClass } from '../models';

export const featureClasses: FeatureClass[] = [
    {
        id: 'PPL', name: 'Populated place', description: 'A city, town, village, or other agglomeration of buildings where people live and work', order: 'a',
    }, {
        id: 'PPLA',
        name: 'Seat of a first-order administrative division',
        description: 'Seat of a first-order administrative division (PPLC takes precedence over PPLA)',
        order: 'b',
    }, { id: 'PPLA2', name: 'Seat of a second-order administrative division', order: 'c' }, { id: 'PPLA3', name: 'Seat of a third-order administrative division', order: 'd' }, { id: 'PPLA4', name: 'Seat of a fourth-order administrative division', order: 'e' }, { id: 'PPLC', name: 'Capital of a political entity', order: 'f' }, {
        id: 'PPLCH', name: 'Historical capital of a political entity', description: 'A former capital of a political entity', order: 'g',
    }, {
        id: 'PPLF', name: 'Farm/village', description: 'A populated place where the population is largely engaged in agricultural activities', order: 'h',
    }, { id: 'PPLG', name: 'Seat of government of a political entity', order: 'i' }, {
        id: 'PPLH', name: 'Historical populated place', description: 'A populated place that no longer exists', order: 'j',
    }, {
        id: 'PPLL', name: 'Populated locality', description: 'An area similar to a locality but with a small group of dwellings or other buildings', order: 'k',
    }, { id: 'PPLQ', name: 'Abandoned populated place', order: 'l' }, {
        id: 'PPLR', name: 'Religious populated place', description: 'A populated place whose population is largely engaged in religious occupations', order: 'm',
    }, {
        id: 'PPLS', name: 'Populated places', description: 'Cities, towns, villages, or other agglomerations of buildings where people live and work', order: 'n',
    }, {
        id: 'PPLW', name: 'Destroyed populated place', description: 'A village, town or city destroyed by a natural disaster, or by war', order: 'o',
    }, { id: 'PPLX', name: 'Section of populated place', order: 'p' }, { id: 'STLMT', name: 'Israeli settlement', order: 'q' },
];
