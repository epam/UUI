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

const initialValue1: DataItemExample[] = Array(20)
    .fill({
        column0: '"1"',
        column1: '2%',
        column2: '"3"',
        column3: '4%',
        column4: '"5"',
    });

const initialValue2: DataItemExample[] = Array(20)
    .fill({
        column0: '1',
        column1: '2',
        column2: '3',
        column3: '4',
        column4: '5',
    });

const TableDataContext1 = createContext<TableDataContextState>(null);

const TableDataContext2 = createContext<TableDataContextState>(null);

export const TableDataContextProvider1: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [value, setValue] = useState<TableDataContextState[0]>(initialValue1);

    const state = useMemo<TableDataContextState>(() => ([value, setValue]), [value]);

    return <TableDataContext1.Provider value={ state }>{ children }</TableDataContext1.Provider>;
};

export const TableDataContextProvider2: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [value, setValue] = useState<TableDataContextState[0]>(initialValue2);

    const state = useMemo<TableDataContextState>(() => ([value, setValue]), [value]);

    return <TableDataContext2.Provider value={ state }>{ children }</TableDataContext2.Provider>;
};

export const useTableDataContext1 = () => useContext(TableDataContext1);
export const useTableDataContext2 = () => useContext(TableDataContext2);
