import { FilterPredicate, IFilterPredicate } from '@epam/uui-core';

type defaultPredicateName = 'numeric' | 'multiPicker' | 'rangeDatePicker';

export const defaultPredicates: Record<defaultPredicateName, IFilterPredicate[]> = {
    numeric: [
        { predicate: 'eq', name: '=', isDefault: true }, { predicate: 'neq', name: '≠' }, { predicate: 'lte', name: '≤' }, { predicate: 'gte', name: '≥' }, { predicate: 'inRange', name: 'In Range' },
    ],
    multiPicker: [{ predicate: 'in', name: 'is', isDefault: true }, { predicate: 'nin', name: 'is not' }],
    rangeDatePicker: [{ predicate: 'inRange', name: 'In Range', isDefault: true }, { predicate: 'notInRange', name: 'Not in Range' }],
};

export const getDefaultPredicate = (predicates: IFilterPredicate[], value: unknown): keyof FilterPredicate<any> => {
    if (!predicates) {
        return null;
    }
    return (Object.keys(value || {})[0] as keyof FilterPredicate<any>)
        || predicates.find((i) => i.isDefault)?.predicate
        || predicates?.[0].predicate as keyof FilterPredicate<any>;
};
