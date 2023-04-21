import React from 'react';
import { Button } from '../Button';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/test-utils';

describe('Button', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Button />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Button
                color="accent"
                mode="outline"
                caption="Click me"
                onClick={ jest.fn }
                icon={ SvgMock }
                isDisabled={ false }
                isDropdown={ true }
                count={ 10 }
                iconPosition="right"
                onClear={ jest.fn }
                isOpen
                clearIcon={ SvgMock }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
