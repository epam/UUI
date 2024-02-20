import React from 'react';
import { Paginator } from '../Paginator';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Paginator', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Paginator
            value={ null }
            onValueChange={ () => {} }
            totalPages={ 10 }
            size="24"
            rawProps={ {
                id: '123',
                'data-my_attr': 'value',
            } }
        />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly when disabled', async () => {
        const tree = await renderSnapshotWithContextAsync(<Paginator
            value={ null }
            onValueChange={ () => {} }
            totalPages={ 10 }
            size="24"
            rawProps={ {
                id: '123',
                'data-my_attr': 'value',
            } }
            isDisabled={ true }
        />);
        expect(tree).toMatchSnapshot();
    });
});
