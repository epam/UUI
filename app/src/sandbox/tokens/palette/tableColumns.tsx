import { DataColumnProps, SortingOption } from '@epam/uui-core';
import { Text } from '@epam/uui';
import { ThemeVarExample } from './components/themeVarExample/themeVarExample';
import React from 'react';
import { TruncText } from './components/truncText/truncText';
import { IThemeVarUI } from './types/types';
import { ThemeVarInfo } from './components/themeVarInfo/themeVarInfo';

enum COL_NAMES {
    path = 'path',
    cssVar = 'cssVar',
    description = 'description',
    useCases = 'useCases',
    actualValue = 'actualValue',
    expectedValue = 'expectedValue',
    status = 'status'
}

const WIDTH = {
    [COL_NAMES.path]: 200, // E.g: core/surfaces/surface-main
    [COL_NAMES.cssVar]: 200, // E.g.: --uui-surface-main
    [COL_NAMES.description]: 100, // Some text
    [COL_NAMES.useCases]: 120, // Some text
    //
    [COL_NAMES.actualValue]: 95,
    [COL_NAMES.expectedValue]: 95,
    [COL_NAMES.status]: 100,
};

export function sortBy(item: IThemeVarUI, sorting: SortingOption): any {
    const key = sorting.field as COL_NAMES;
    if (key === COL_NAMES.status) {
        const hasErrors = item.valueCurrent.errors.length > 0;
        return String(hasErrors);
    }

    return item[key as keyof IThemeVarUI];
}

export function getColumns(): DataColumnProps<IThemeVarUI>[] {
    return [
        {
            key: COL_NAMES.path,
            caption: 'Path',
            render: (item) => {
                return (
                    <TruncText text={ item.id } />
                );
            },
            width: WIDTH.path,
            isSortable: true,
        },
        {
            key: COL_NAMES.cssVar,
            caption: 'Name',
            render: (item) => {
                return (
                    <TruncText text={ item.cssVar } />
                );
            },
            width: WIDTH.cssVar,
            isSortable: true,
        },
        {
            key: COL_NAMES.actualValue,
            caption: 'Actual',
            render: (item) => {
                return (
                    <ThemeVarExample themeVar={ item } mode="showActual" />
                );
            },
            width: WIDTH.actualValue,
        },
        {
            key: COL_NAMES.expectedValue,
            caption: 'Expected',
            render: (item) => {
                return (
                    <ThemeVarExample themeVar={ item } mode="showExpected" />
                );
            },
            width: WIDTH.expectedValue,
        },
        {
            key: COL_NAMES.status,
            caption: 'Status',
            render: (item) => {
                return (
                    <ThemeVarInfo themeVar={ item } />
                );
            },
            width: WIDTH.status,
            isSortable: true,
        },
        {
            key: COL_NAMES.description,
            caption: 'Description',
            render: (item) => {
                return (
                    <Text color="primary">
                        {item.description}
                    </Text>
                );
            },
            width: WIDTH.description,
            grow: 1,
        },
        {
            key: COL_NAMES.useCases,
            caption: 'Use Cases',
            render: (item) => {
                return (
                    <Text color="primary">
                        {item.useCases}
                    </Text>
                );
            },
            width: WIDTH.useCases,
        },
    ];
}
