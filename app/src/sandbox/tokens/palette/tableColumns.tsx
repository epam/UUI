import { DataColumnProps } from '@epam/uui-core';
import { IThemeVar } from './types/sharedTypes';
import { Text } from '@epam/uui';
import { ThemeVarExample } from './components/themeVarExample/themeVarExample';
import React from 'react';
import { TruncText } from './components/truncText/truncText';

const WIDTH = {
    path: 200, // E.g: core/surfaces/surface-main
    cssVar: 200, // E.g.: --uui-surface-main
    description: 100, // Some text
    useCases: 100, // Some text
    //
    /**
     * Actual:
     *  1) rectangle (background-color: var(--uui-surface-main))
     *  2) calculated value (e.g.: #AF0890)
     * Expected:
     *  1) rectangle (background-color: #AF0890)
     *  2) expected value (e.g.: #AF0890)
     *  3) cssVar if it exists (e.g.: --uui-neutral-0)
     *  4) Warning icon if actual !== expected
     */
    example: 200,
};

export function getColumns(): DataColumnProps<IThemeVar>[] {
    return [
        {
            key: 'path',
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
            key: 'cssVar',
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
            key: 'example',
            caption: 'Example (actual/expected)',
            render: (item) => {
                return (
                    <ThemeVarExample themeVar={ item } />
                );
            },
            width: WIDTH.example,
            grow: 1,
        },
        {
            key: 'description',
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
            key: 'useCases',
            caption: 'Use Cases',
            render: (item) => {
                return (
                    <Text color="primary">
                        {item.useCases}
                    </Text>
                );
            },
            width: WIDTH.useCases,
            grow: 1,
        },
    ];
}
