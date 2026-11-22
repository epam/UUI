import React from 'react';
import { BurgerButton } from '../BurgerButton';
import { renderSnapshotWithContextAsync, renderWithContextAsync, screen } from '@epam/uui-test-utils';
import { ReactComponent as CalendarIcon } from '@epam/assets/icons/action-calendar-fill.svg';

describe('BurgerButton', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<BurgerButton />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <BurgerButton
                caption="Test button"
                icon={ CalendarIcon }
                href="#"
                target="_blank"
                type="secondary"
                isDropdown
                isOpen={ false }
                isActive={ true }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should apply cx together with its own classes', async () => {
        await renderWithContextAsync(<BurgerButton caption="Item" cx="custom-class" />);

        const button = screen.getByRole('menuitem');
        expect(button).toHaveClass('custom-class');
        expect(button).toHaveClass('uui-main_menu-burger-button');
    });

    it('should set indent level css variable, if indentLevel is passed', async () => {
        await renderWithContextAsync(<BurgerButton caption="Item" indentLevel={ 2 } />);

        expect(screen.getByRole('menuitem').style.getPropertyValue('--uui-burger_btn-indent-level')).toBe('2');
    });

    it('should keep styles from rawProps, if indentLevel is passed', async () => {
        await renderWithContextAsync(<BurgerButton caption="Item" indentLevel={ 1 } rawProps={ { style: { color: 'red' } } } />);

        const button = screen.getByRole('menuitem');
        expect(button.style.getPropertyValue('--uui-burger_btn-indent-level')).toBe('1');
        expect(button.style.color).toBe('red');
    });

    it('should not set indent level css variable, if indentLevel is not passed', async () => {
        await renderWithContextAsync(<BurgerButton caption="Item" />);

        expect(screen.getByRole('menuitem').style.getPropertyValue('--uui-burger_btn-indent-level')).toBe('');
    });
});
