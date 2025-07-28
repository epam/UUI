import React from 'react';
import { TabButton } from '../TabButton';
import { renderSnapshotWithContextAsync, renderWithContextAsync, screen, userEvent } from '@epam/uui-test-utils';
import { ReactComponent as calendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('TabButton', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<TabButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <TabButton
                onClick={ jest.fn }
                icon={ calendarIcon }
                isDisabled={ false }
                withNotify={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    test('calls `click` method of external ref when Space key is pressed on a focused link', async () => {
        const click = jest.fn();
        function Example(): React.ReactNode {
            const ref = React.useRef<HTMLAnchorElement | null>(null);

            // We need to set the click handler, when the `ref` becomes linked to the button.
            React.useImperativeHandle(
                ref,
                () => {
                    return {
                        click,
                    } as unknown as HTMLAnchorElement;
                },
                [],
            );

            return (
                <TabButton
                    ref={ ref }
                    caption="Tab button"
                    link={ {
                        pathname: '/',
                    } }
                />
            );
        }
        await renderWithContextAsync(
            <Example />,
        );

        await userEvent.tab();
        const tabButton = screen.getByRole(
            'tab',
            {
                name: /tab button/i,
            },
        );
        expect(tabButton).toHaveFocus();

        await userEvent.keyboard(' ');
        expect(click).toBeCalled();
    });
});
