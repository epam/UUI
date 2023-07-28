import React from 'react';
import { Slider } from '../Slider';
import {
    mockReactPortalsForSnapshots,
    renderSnapshotWithContextAsync,
} from '@epam/uui-test-utils';

describe('Slider', () => {
    it('should render with minimum props', async () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const tree = await renderSnapshotWithContextAsync(<Slider value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } step={ 1 } />);
        mockClear();
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const { mockClear } = mockReactPortalsForSnapshots();
        const tree = await renderSnapshotWithContextAsync(<Slider value={ null } onValueChange={ jest.fn } min={ 0 } max={ 50 } step={ 1 } renderLabel={ (num) => `${num}` } />);
        mockClear();
        expect(tree).toMatchSnapshot();
    });
});
