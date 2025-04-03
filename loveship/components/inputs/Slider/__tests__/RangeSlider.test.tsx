import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { RangeSlider } from '../RangeSlider';

describe('RangeSlider', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<RangeSlider min={ 1 } max={ 100 } step={ 5 } value={ { from: 0, to: 50 } } onValueChange={ jest.fn() } />);
        expect(tree).toMatchSnapshot();
    });
});
