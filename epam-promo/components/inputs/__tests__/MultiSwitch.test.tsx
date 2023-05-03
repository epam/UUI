import React from 'react';
import { MultiSwitch } from '../MultiSwitch';
import { renderer } from '@epam/uui-test-utils';

it('should be rendered correctly', () => {
    const tree = renderer
        .create(
            <MultiSwitch
                value={ 1 }
                onValueChange={ jest.fn }
                items={ [{ id: 1, caption: 'On' }, { id: 2, caption: 'Off' }] }
            />,
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});
