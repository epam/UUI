import React from 'react';
import { render } from '@epam/uui-test-utils';
import { DataTableCell } from '../DataTableCell';

describe('DataTableCell', () => {
    it('should be rendered correctly', () => {
        const { asFragment } = render(
            <DataTableCell
                key="test"
                isFirstColumn
                isLastColumn
                column={ {
                    key: 'test',
                    caption: 'Test',
                    render: () => <div>Test</div>,
                    width: 150,
                    fix: 'left',
                } }
                rowProps={ {
                    id: '1',
                    rowKey: '1',
                    index: 1,
                    value: {},
                    dnd: {
                        canAcceptDrop: () => null,
                        onDrop: jest.fn,
                        srcData: {},
                        dstData: {},
                    },
                } }
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it('should be rendered correctly with additional props', () => {
        const { asFragment } = render(
            <DataTableCell
                key="test"
                isFirstColumn
                isLastColumn
                column={ {
                    key: 'test',
                    caption: 'Test',
                    render: () => <div>Test</div>,
                    width: 150,
                    fix: 'left',
                    info: 'test',
                    isSortable: true,
                } }
                rowProps={ {
                    id: '1',
                    rowKey: '1',
                    index: 1,
                    value: {},
                    dnd: {
                        canAcceptDrop: () => null,
                        onDrop: jest.fn,
                        srcData: {},
                        dstData: {},
                    },
                } }
                size="48"
            />,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
