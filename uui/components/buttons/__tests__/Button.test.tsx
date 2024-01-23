import React from 'react';
import { Button } from '../Button';
import { renderSnapshotWithContextAsync, SvgMock } from '@epam/uui-test-utils';

describe('Button', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<Button />);
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Button
                color="accent"
                fill="outline"
                caption="Click me"
                onClick={ jest.fn }
                icon={ SvgMock }
                isDisabled={ false }
                isDropdown={ true }
                iconPosition="right"
                onClear={ jest.fn }
                isOpen
                clearIcon={ SvgMock }
                rawProps={ {
                    id: '123',
                    'data-my_attr': 'value',
                } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
