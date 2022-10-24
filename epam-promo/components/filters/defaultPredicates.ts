import { IFilterPredicate } from "@epam/uui-core";

type defaultPredicateName = 'numeric' | 'multiPicker' | 'rangeDatePicker';

export const defaultPredicates: Record<defaultPredicateName, IFilterPredicate[]> = {
    numeric: [
        { predicate: 'eq', name: '=', isDefault: true },
        { predicate: 'neq', name: '≠'},
        { predicate: 'lte', name: '≤'},
        { predicate: 'gte', name: '≥'},
        { predicate: 'inRange', name: 'In Range' },
    ],
    multiPicker: [
        { predicate: 'in', name: 'is' },
        { predicate: 'nin', name: 'is not', isDefault: true},
    ],
    rangeDatePicker: [
        { predicate: 'inRange', name: 'In Range', isDefault: true },
        { predicate: 'notInRange', name: 'Not in Range' },
    ],
};