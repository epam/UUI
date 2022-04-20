import React, { createContext, Dispatch, FC, SetStateAction, useContext, useMemo, useState } from "react";

export interface DataItemExample {
    column0: string;
    column1: string;
    column2: string;
    column3: string;
    column4: string;
}

export type TableDataContextState = [
    value: DataItemExample[],
    setValue: Dispatch<SetStateAction<DataItemExample[]>>
];

const initialValue: DataItemExample[] = Array(20)
    .fill({
        column0: '1',
        column1: '2',
        column2: '3',
        column3: '4',
        column4: '5',
    });

const TableDataContext = createContext<TableDataContextState>(null);

export const TableDataContextProvider: FC = ({ children }) => {
    const [value, setValue] = useState<TableDataContextState[0]>(initialValue);

    const state = useMemo<TableDataContextState>(() => ([value, setValue]), [value]);

    return <TableDataContext.Provider value={ state }>{ children }</TableDataContext.Provider>;
};

export const useTableDataContext = () => useContext(TableDataContext);
