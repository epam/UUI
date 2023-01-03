import React from 'react';
import { ColumnsConfigurationModal } from '../ColumnsConfigurationModal';
import { getDefaultColumnsConfig } from '@epam/uui-core';
import { renderWithContextAsync } from '@epam/test-utils';

const mockColumns = [
    {
        key: 'id',
        caption: 'ID',
        render: (product: any) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: true,
        grow: 0, shrink: 0, width: 96,
    },
    {
        key: 'level',
        caption: 'Level',
        render: (product: any) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: true,
        grow: 0, shrink: 0, width: 96,
    },
];

describe('ColumnsConfigurationModal', () => {
    it('should be rendered correctly', async () => {
        const modalProps = {
            isActive: true,
            key: 'test',
            zIndex: 1,
            abort: jest.fn,
            success: jest.fn,
        };
        const defaultConfig = getDefaultColumnsConfig(mockColumns);
        const tree = await renderWithContextAsync(
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ mockColumns }
                columnsConfig={ defaultConfig }
                defaultConfig={ defaultConfig }
            />);
        expect(tree).toMatchSnapshot();
    });
});


