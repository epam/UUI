import React from 'react';
import { FileCard } from '../FileCard';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('FileCard', () => {
    it('should be rendered correctly with Excel file', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <FileCard
                file={ {
                    id: 1,
                    name: 'Test.xls',
                    size: 12546,
                    progress: 0,
                } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with doc file', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <FileCard
                file={ {
                    id: 1,
                    name: 'Test.doc',
                    size: 12546,
                    progress: 0,
                } }
                width={ 140 }
                onClick={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with img file', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <FileCard
                file={ {
                    id: 1,
                    name: 'Test.gif',
                    size: 12546,
                    progress: 100,
                } }
                width={ 140 }
                onClick={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
