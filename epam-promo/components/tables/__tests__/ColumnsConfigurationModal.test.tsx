import React from 'react';
import { ColumnsConfigurationModal } from '../columnsConfigurationModal/ColumnsConfigurationModal';
import renderer from 'react-test-renderer';
import { getDefaultColumnsConfig } from '@epam/uui-core';
import { Product } from '@epam/uui-docs';

const mockColumns = [
    {
        key: 'id',
        caption: 'ID',
        render: (product: Product) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: true,
        grow: 0, shrink: 0, width: 96,
    },
    {
        key: 'level',
        caption: 'Level',
        render: (product: Product) => <div>{ product }</div>,
        isSortable: true,
        isAlwaysVisible: true,
        grow: 0, shrink: 0, width: 96,
    },
];

describe('ColumnsConfigurationModal', () => {
    it('should be rendered correctly', () => {
        const modalProps = {
            isActive: true,
            key: 'test',
            zIndex: 1,
            abort: jest.fn,
            success: jest.fn,
        };
        const defaultConfig = getDefaultColumnsConfig(mockColumns);
        const tree = renderer
            .create(<ColumnsConfigurationModal
                modalProps={ modalProps }
                columns={ mockColumns }
                columnsConfig={ defaultConfig }
                defaultConfig={ defaultConfig }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


