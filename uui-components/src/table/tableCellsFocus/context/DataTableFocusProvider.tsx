import React, { useMemo } from 'react';
import { DataTableFocusContext } from './DataTableFocusContext';

export interface DataTableFocusProviderProps extends React.PropsWithChildren {}

export function DataTableFocusProvider({ children }: DataTableFocusProviderProps) {
    const value = useMemo(() => ({}), []);

    return (
        <DataTableFocusContext.Provider value={ value }>
            {children}
        </DataTableFocusContext.Provider>
    );
}
