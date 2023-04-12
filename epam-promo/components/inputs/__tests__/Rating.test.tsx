import React from 'react';
import { Rating } from '../Rating';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';

describe('Rating', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Rating
                value={ null }
                onValueChange={ jest.fn }
            />
        );

        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Rating
                value={ null }
                onValueChange={ jest.fn }
                size={ 18 }
                step={ 1 }
                from={ 2 }
                to={ 4 }
            />
        );

        expect(tree).toMatchSnapshot();
    });
});


