import React from 'react';
import { CheckboxGroup } from '../CheckboxGroup';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('CheckboxGroup', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <CheckboxGroup
                value={ null }
                onValueChange={ () => {} }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <CheckboxGroup
                value={ null }
                onValueChange={ () => {} }
                items={ [{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }] }
                direction="horizontal"
                isDisabled
            />,
        );
            
        expect(tree).toMatchSnapshot();
    });
});
