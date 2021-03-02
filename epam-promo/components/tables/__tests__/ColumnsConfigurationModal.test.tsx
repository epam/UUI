import React from 'react';
import { ColumnsConfigurationModal } from '../ColumnsConfigurationModal';
import renderer from 'react-test-renderer';
import { getDefaultColumnsConfig } from '@epam/uui';

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
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<ColumnsConfigurationModal
                key='test'
                zIndex={ 1 }
                abort={ jest.fn }
                success={ jest.fn }
                columns={ mockColumns }
                columnsConfig={ getDefaultColumnsConfig(mockColumns) }
                isActive
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


