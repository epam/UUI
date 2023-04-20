import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { Rating } from '../Rating';

describe('Rating', () => {
    const value = 2;
    const onChange = jest.fn();

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Rating value={ value } onValueChange={ onChange } />);

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Rating value={ value } onValueChange={ onChange } step={ 1 } from={ 1 } to={ 4 } size={ 24 } color="sky" />);

        expect(tree).toMatchSnapshot();
    });
});
