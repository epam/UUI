import React from 'react';
import { MultiSwitch } from '../MultiSwitch';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

it('should be rendered correctly', async () => {
    const tree = await renderSnapshotWithContextAsync(
        <MultiSwitch
            value={ 1 }
            onValueChange={ jest.fn }
            items={ [{ id: 1, caption: 'On' }, { id: 2, caption: 'Off' }] }
        />,
    );
    expect(tree).toMatchSnapshot();
});
