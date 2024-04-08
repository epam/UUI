import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Checkbox } from '@epam/uui';
import { ReactComponent as ActionAccountFillIcon } from '@epam/assets/icons/action-account-fill.svg';

describe('TestComponent', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Checkbox value={ true } onValueChange={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Checkbox
                value={ true }
                onValueChange={ jest.fn }
                size="12"
                mode="cell"
                isDisabled={ true }
                isInvalid={ true }
                isReadonly={ true }
                isRequired={ true }
                icon={ ActionAccountFillIcon }
                indeterminate={ true }
                label="Test label"
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
