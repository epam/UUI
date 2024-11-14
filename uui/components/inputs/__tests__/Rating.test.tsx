import React from 'react';
import { Rating } from '../Rating';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Rating', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Rating value={ null } onValueChange={ jest.fn } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with more props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Rating value={ null } onValueChange={ jest.fn } size={ 24 } step={ 1 } />);

        expect(tree).toMatchSnapshot();
    });
});
