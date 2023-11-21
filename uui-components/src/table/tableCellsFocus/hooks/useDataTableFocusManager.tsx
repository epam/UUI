import { useMemo } from 'react';
import { DataTableFocusManager } from '../DataTableFocusManager';
import { DataTableFocusManagerProps } from '../types';

export function useDataTableFocusManager(props: DataTableFocusManagerProps = {}, deps: unknown[]): DataTableFocusManager {
    const tableFocusManager = useMemo(
        () => new DataTableFocusManager(props),
        deps,
    );

    return tableFocusManager;
}
