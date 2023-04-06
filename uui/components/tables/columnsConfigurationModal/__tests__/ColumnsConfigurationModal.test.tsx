import React from 'react';
import { ColumnsConfigurationModal } from '../ColumnsConfigurationModal';
import { DataColumnProps, getDefaultColumnsConfig } from '@epam/uui-core';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';

const mockColumns: DataColumnProps[] = [
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

const mockHiddenColumns: DataColumnProps[] = [
    {
        key: 'id',
        caption: 'ID',
        render: (product: any) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: false,
        grow: 0, shrink: 0, width: 96,
        isHiddenByDefault: true,
    },
    {
        key: 'level',
        caption: 'Level',
        render: (product: any) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: false,
        isHiddenByDefault: true,
        grow: 0, shrink: 0, width: 96,
    },
];

const modalProps = {
    isActive: true,
    key: 'test',
    zIndex: 1,
    abort: jest.fn,
    success: jest.fn,
};

describe('ColumnsConfigurationModal', () => {
    it('should be rendered correctly', async () => {
        const defaultConfig = getDefaultColumnsConfig(mockColumns);
        const tree = await renderSnapshotWithContextAsync(
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ mockColumns }
                columnsConfig={ defaultConfig }
                defaultConfig={ defaultConfig }
            />);
        expect(tree).toMatchSnapshot();
    });

    it('should disable Apply button if all columns are hidden', async () => {
        const defaultConfig = getDefaultColumnsConfig(mockHiddenColumns);
        const tree = await renderSnapshotWithContextAsync(
            <ColumnsConfigurationModal
                { ...modalProps }
                columns={ mockHiddenColumns }
                columnsConfig={ defaultConfig }
                defaultConfig={ defaultConfig }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
