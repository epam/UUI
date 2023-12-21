import { DataColumnProps, SortingOption, TableFiltersConfig } from '@epam/uui-core';
import { FlexCell, RadioGroup, Text } from '@epam/uui';
import { ThemeVarExample } from './components/themeVarExample/themeVarExample';
import React from 'react';
import { TruncText } from './components/truncText/truncText';
import { IThemeVarUI, TThemeVarUiErr } from './types/types';
import { ThemeVarInfo } from './components/themeVarInfo/themeVarInfo';
import { TFigmaThemeName } from './types/sharedTypes';
import { getExpectedValue } from './utils/themeVarUtils';
//
import css from './paletteTable.module.scss';

enum COL_NAMES {
    path = 'path',
    cssVar = 'cssVar',
    description = 'description',
    useCases = 'useCases',
    actualValue = 'actualValue',
    expectedValue = 'expectedValue',
    status = 'status'
}
export enum STATUS_FILTER {
    all= 'All',
    ok= 'OK',
    absent = 'Absent',
    mismatched = 'Mismatched'
}

export type TTokensFilter = {
    status: STATUS_FILTER | undefined,
};

const WIDTH = {
    [COL_NAMES.path]: 200, // E.g: core/surfaces/surface-main
    [COL_NAMES.cssVar]: 200, // E.g.: --uui-surface-main
    [COL_NAMES.description]: 100, // Some text
    [COL_NAMES.useCases]: 120, // Some text
    //
    [COL_NAMES.actualValue]: 105,
    [COL_NAMES.expectedValue]: 105,
    [COL_NAMES.status]: 120,
};

export function sortBy(item: IThemeVarUI, sorting: SortingOption): any {
    const key = sorting.field as COL_NAMES;
    if (key === COL_NAMES.status) {
        const hasErrors = item.valueCurrent.errors.length > 0;
        return String(hasErrors);
    } else if (key === COL_NAMES.actualValue) {
        return String(item.valueCurrent.value);
    } else if (key === COL_NAMES.expectedValue) {
        const expected = getExpectedValue({ themeVar: item });
        return String(expected.value);
    }

    return item[key as keyof IThemeVarUI];
}

export function getColumns(figmaTheme: TFigmaThemeName | undefined): DataColumnProps<IThemeVarUI>[] {
    const arr: DataColumnProps<IThemeVarUI, string, TTokensFilter>[] = [
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
            isSortable: true,
            textAlign: 'center',
        },
        Boolean(figmaTheme) && {
            key: COL_NAMES.expectedValue,
            caption: 'Expected',
            render: (item) => {
                if (figmaTheme) {
                    return (
                        <ThemeVarExample themeVar={ item } mode="showExpected" />
                    );
                }
                return <Text>N/A</Text>;
            },
            width: WIDTH.expectedValue,
            isSortable: true,
            textAlign: 'center',
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
            isAlwaysVisible: true,
            textAlign: 'center',
            isFilterActive: (f) => !!f.status && f.status !== STATUS_FILTER.all,
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

    return arr.filter((c) => {
        return typeof c === 'object';
    });
}

export function getFilter(filter: TTokensFilter) {
    return (item: IThemeVarUI) => {
        if (filter) {
            switch (filter.status) {
                case STATUS_FILTER.absent: {
                    return !!item.valueCurrent.errors.find(({ type }) => type === TThemeVarUiErr.VAR_ABSENT);
                }
                case STATUS_FILTER.mismatched: {
                    return !!item.valueCurrent.errors.find(({ type }) => type === TThemeVarUiErr.VALUE_MISMATCHED);
                }
                case STATUS_FILTER.ok: {
                    return !item.valueCurrent.errors.length;
                }
                default: {
                    return true;
                }
            }
        }
        return true;
    };
}

export type TTotals = Record<STATUS_FILTER, number>;
export function getFiltersConfig(totals: TTotals): TableFiltersConfig<TTokensFilter>[] {
    return [
        {
            field: COL_NAMES.status,
            columnKey: COL_NAMES.status,
            title: 'Status',
            type: 'custom',
            isAlwaysVisible: true,
            render: (props) => {
                const items = Object.values(STATUS_FILTER).map((keyStr: string) => {
                    const id = keyStr as STATUS_FILTER;
                    return {
                        id,
                        name: `${id} (${totals[id]})`,
                    };
                });

                return (
                    <FlexCell cx={ css.radioGroupFilter } width="auto">
                        <RadioGroup
                            items={ items }
                            value={ props.value || STATUS_FILTER.all }
                            onValueChange={ props.onValueChange }
                            direction="vertical"
                        />
                    </FlexCell>
                );
            },
            getTogglerValue: (props) => {
                if (props.value) {
                    return props.value || STATUS_FILTER.all;
                }
            },
        },
    ];
}
