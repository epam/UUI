import { DataColumnProps, SortingOption, TableFiltersConfig } from '@epam/uui-core';
import { FlexCell, RadioGroup, Text } from '@epam/uui';
import { TokenExample } from '../tokenExample/tokenExample';
import React from 'react';
import { TruncText } from '../truncText/truncText';
import {
    COL_NAMES,
    isTokenRowGroup,
    IThemeVarUI,
    ITokenRow,
    STATUS_FILTER,
    TLoadThemeTokensParams,
    TThemeTokenValueType,
    TTokensLocalFilter,
    TTotals,
} from '../../types/types';
import { TokenInfo } from '../tokenInfo/tokenInfo';
//
import css from './paletteTable.module.scss';
import { getFigmaTheme } from '../../utils/themeVarUtils';
import { ThemesList } from '../../../../../data';

const WIDTH = {
    [COL_NAMES.path]: 250, // E.g: core/surfaces/surface-main
    [COL_NAMES.cssVar]: 250, // E.g.: --uui-surface-main
    [COL_NAMES.description]: 100, // Some text
    [COL_NAMES.useCases]: 120, // Some text
    //
    [COL_NAMES.actualValue]: 125,
    [COL_NAMES.expectedValue]: 125,
    [COL_NAMES.status]: 120,
    [COL_NAMES.published]: 100,
};

export const getSortBy = () => {
    return function sortBy(item: ITokenRow, sorting: SortingOption): any {
        const key = sorting.field as COL_NAMES;

        if (isTokenRowGroup(item)) {
            if (key === COL_NAMES.path) {
                return item.id;
            }
            return '';
        }

        switch (key) {
            case COL_NAMES.path: {
                return String(item.id);
            }
            case COL_NAMES.expectedValue: {
                const expected = item.value.figma;
                return String(expected?.value);
            }
            case COL_NAMES.actualValue: {
                return String(item.value.browser);
            }
            case COL_NAMES.status: {
                const hasErrors = item.value.errors.length > 0;
                return String(hasErrors);
            }
            default: {
                return item[key as keyof IThemeVarUI];
            }
        }
    };
};

export function getColumns(
    params: { uuiTheme: ThemesList, valueType: TThemeTokenValueType, filter: TLoadThemeTokensParams['filter'] },
): DataColumnProps<ITokenRow>[] {
    const { uuiTheme, filter, valueType } = params;
    const figmaTheme = getFigmaTheme(uuiTheme);
    const expectedValueColumnsArr: DataColumnProps<ITokenRow, string, TTokensLocalFilter>[] = [];

    if (figmaTheme) {
        const info = valueType === TThemeTokenValueType.chain
            ? 'This is what Figma expects. The value is taken from the chain of aliases (valuesByMode)'
            : 'This is what Figma expects. The value is taken directly from resolvedValuesByMode';
        expectedValueColumnsArr.push({
            key: COL_NAMES.expectedValue,
            caption: 'Expected',
            info,
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
                if (figmaTheme) {
                    return (
                        <TokenExample token={ item } mode="showExpected" />
                    );
                }
                return <Text>N/A</Text>;
            },
            width: WIDTH.expectedValue,
            isSortable: false,
            textAlign: 'center',
            alignSelf: 'center',
        });
    }

    const arr: DataColumnProps<ITokenRow, string, TTokensLocalFilter>[] = [
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
            textAlign: 'left',
            alignSelf: 'center',
            isFilterActive: () => !!filter.path?.trim(),
        },
        {
            key: COL_NAMES.cssVar,
            caption: 'Name',
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
                return (
                    <TruncText text={ item.cssVar } />
                );
            },
            width: WIDTH.cssVar,
            isSortable: true,
            textAlign: 'left',
            alignSelf: 'center',
        },
        {
            key: COL_NAMES.actualValue,
            caption: 'Actual',
            info: 'Displays actual value (it depends on current theme)',
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
                return (
                    <TokenExample token={ item } mode="showActual" />
                );
            },
            width: WIDTH.actualValue,
            isSortable: false,
            textAlign: 'center',
            alignSelf: 'center',
        },
        ...expectedValueColumnsArr,
        {
            key: COL_NAMES.status,
            caption: 'Status',
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
                return (
                    <TokenInfo token={ item } />
                );
            },
            width: WIDTH.status,
            isSortable: true,
            isAlwaysVisible: true,
            textAlign: 'center',
            isFilterActive: (f) => !!f.status && f.status !== STATUS_FILTER.all,
        },
        {
            key: COL_NAMES.published,
            caption: 'Published',
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
                return (
                    <Text color="primary">
                        {item.cssVarSupport === 'supported' ? 'y' : 'n'}
                    </Text>
                );
            },
            textAlign: 'center',
            alignSelf: 'center',
            width: WIDTH[COL_NAMES.published],
        },
        {
            key: COL_NAMES.description,
            caption: 'Description',
            render: (item) => {
                if (isTokenRowGroup(item)) {
                    return '';
                }
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
                if (isTokenRowGroup(item)) {
                    return '';
                }
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

export function getFiltersConfig(totals: TTotals): TableFiltersConfig<TTokensLocalFilter>[] {
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
                            name="status"
                            items={ items }
                            value={ props.value || STATUS_FILTER.all }
                            onValueChange={ props.onValueChange }
                            direction="vertical"
                        />
                    </FlexCell>
                );
            },
            getTogglerValue: (props) => {
                const id = (props.value || STATUS_FILTER.all) as STATUS_FILTER;
                return `${id} (${totals[id]})`;
            },
        },
    ];
}
