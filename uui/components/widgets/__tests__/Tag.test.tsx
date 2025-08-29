import React from 'react';
import { Tag } from '../Tag';
import { renderSnapshotWithContextAsync, renderWithContextAsync, screen, userEvent } from '@epam/uui-test-utils';
// @ts-expect-error TODO: fix the error about unresolved import.
// eslint-disable-next-line import/no-unresolved
import { ReactComponent as CalendarIcon } from '@epam-assets/icons/action-calendar-fill.svg';

describe('Tag', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tag />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tag
                caption="Test badge"
                icon={ CalendarIcon }
                count={ 12 }
                onIconClick={ () => {} }
                onClick={ () => {} }
                onClear={ () => {} }
                size="36"
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should call `onClear` callback when activated using keyboard navigation', async () => {
        const onClearMock = jest.fn();

        await renderWithContextAsync(
            <Tag
                caption="Test badge"
                icon={ CalendarIcon }
                onClear={ onClearMock }
            />,
        );

        const tag = await screen.findByText(/test badge/i);
        expect(tag).toBeInTheDocument();

        const clearButton = await screen.findByRole(
            'button',
            {
                name: /remove tag/i,
            },
        );
        expect(clearButton).toBeInTheDocument();
        expect(clearButton).not.toHaveFocus();

        await userEvent.click(tag);
        await userEvent.tab();
        expect(clearButton).toHaveFocus();

        await userEvent.keyboard('{Enter}');
        expect(onClearMock).toBeCalled();
    });

    it('calls onIconClick', async () => {
        const onIconClick = jest.fn();
        await renderWithContextAsync(
            <Tag
                caption="Test badge"
                icon={ CalendarIcon }
                onIconClick={ onIconClick }
            />,
        );
        const clickableIcon = screen.getByRole(
            'button',
            {
                name: /icon in input/i,
            },
        );

        await userEvent.click(clickableIcon);

        expect(onIconClick).toBeCalledTimes(1);
    });
});
