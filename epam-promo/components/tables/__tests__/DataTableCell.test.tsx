import React from 'react';
import { DataTableCell } from '../DataTableCell';
import renderer from 'react-test-renderer';

describe('DataTableCell', () => {
    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableCell
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
                    dnd: {
                        canAcceptDrop: (params) => null,
                        onDrop: jest.fn,
                        srcData: {},
                        dstData: {},
                    },
                } }
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', () => {
        const tree = renderer
            .create(<DataTableCell
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
                    dnd: {
                        canAcceptDrop: (params) => null,
                        onDrop: jest.fn,
                        srcData: {},
                        dstData: {},
                    },
                } }
                isLastColumn
                padding='24'
                size='48'
                reusePadding='auto'
            />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});


