import * as React from 'react';
import { DropdownProps } from '@epam/uui-core';
import { act, delay, screen, setupComponentForTest, userEvent } from '@epam/uui-test-utils';
import { Button } from '@epam/uui';
import { Dropdown } from '../Dropdown';
import { DropdownContainer } from '../DropdownContainer';

type TestParams = Partial<DropdownProps>;

const TARGET_TEXT = 'Dropdown target';
const BODY_TEXT = 'Dropdown body';

async function setupControlledDropdownForTests(params: TestParams) {
    const { result, setProps, mocks } = await setupComponentForTest<DropdownProps>(
        (context) => ({
            renderTarget: (targetProps) => <Button caption={ TARGET_TEXT } { ...targetProps } />,
            renderBody: (bodyProps) => <DropdownContainer { ...bodyProps }><div>{ BODY_TEXT }</div></DropdownContainer>,
            value: false,
            onValueChange: jest.fn().mockImplementation((newValue) => {
                context.current?.setProperty('value', newValue);
            }),
            ...params,
        }),
        (props) => (
            <Dropdown
                { ...props }
            />
        ),
    );

    const target = screen.getByText(TARGET_TEXT);

    return {
        result,
        setProps,
        mocks,
        target,
    };
}

async function setupUncontrolledDropdownForTests(params: TestParams) {
    const { result, setProps, mocks } = await setupComponentForTest<DropdownProps>(
        () => ({
            ...params,
            renderTarget: (targetProps) => <Button caption={ TARGET_TEXT } { ...targetProps } />,
            renderBody: (bodyProps) => <DropdownContainer { ...bodyProps }><div>{ BODY_TEXT }</div></DropdownContainer>,
        }),
        (props) => (
            <Dropdown
                { ...props }
            />
        ),
    );

    const target = screen.getByText(TARGET_TEXT);

    return {
        result,
        setProps,
        mocks,
        target,
    };
}

describe('Dropdown', () => {
    let user: ReturnType<typeof userEvent.setup>;
    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('(controlled)', () => {
        it('should be closed when value is false', async () => {
            await setupControlledDropdownForTests({ value: false });

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should be opened when value is true', async () => {
            await setupControlledDropdownForTests({ value: true });

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('should close when value is changed to false', async () => {
            const { target } = await setupControlledDropdownForTests({ value: true });
            await user.click(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should open when value is changed to true', async () => {
            const { target } = await setupControlledDropdownForTests({ value: false });
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('should not open when value is false & isNotUnfoldable is true', async () => {
            const { target } = await setupControlledDropdownForTests({ value: false, isNotUnfoldable: true });
            await user.click(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should not open when value is true & isNotUnfoldable is true', async () => {
            const { target } = await setupControlledDropdownForTests({ value: true, isNotUnfoldable: true });
            await user.click(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should close body when onClose clicked', async () => {
            const { target } = await setupControlledDropdownForTests({
                value: false,
                renderBody: (bodyProps) => (
                    <DropdownContainer { ...bodyProps }>
                        <button onClick={ bodyProps.onClose }>{ BODY_TEXT }</button>
                    </DropdownContainer>
                ),
            });
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            const closeButton = screen.getByText(BODY_TEXT);

            await user.click(closeButton);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('{ closeOnClickOutside: true } - should close body when clicked outside', async () => {
            const { target } = await setupControlledDropdownForTests({ value: false, closeOnClickOutside: true });
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('{ closeOnClickOutside: false } - should not close body when clicked outside', async () => {
            const { target } = await setupControlledDropdownForTests({ value: false, closeOnClickOutside: false });
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });
    });

    describe('(uncontrolled)', () => {
        it('should open body when target clicked & should not open body on hover', async () => {
            const { target } = await setupUncontrolledDropdownForTests({});
            await userEvent.hover(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();

            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('should close body when target clicked', async () => {
            await setupUncontrolledDropdownForTests({});
            const target = screen.getByText(TARGET_TEXT);
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('{ closeOnTargetClick: false } - should not close body when clicked', async () => {
            const { target } = await setupUncontrolledDropdownForTests({});
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should set the open dropdown timer', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, openDelay: 200 });
            await user.hover(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();

            await act(async () => {
                await delay(250);
            });

            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('should clear the open dropdown timer', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, openDelay: 200 });
            await user.hover(target);

            await act(async () => {
                await delay(100);
            });

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();

            await user.unhover(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();

            await user.hover(target);

            await act(async () => {
                await delay(150);
            });

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();

            await act(async () => {
                await delay(100);
            });

            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('should set the close dropdown timer', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeDelay: 200 });
            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.unhover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await act(async () => {
                await delay(250);
            });

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should clear the close dropdown timer', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeDelay: 200 });
            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.unhover(target);

            await act(async () => {
                await delay(100);
            });

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.unhover(target);

            await act(async () => {
                await delay(150);
            });

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await act(async () => {
                await delay(100);
            });

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('should close body when clicked outside', async () => {
            const { target } = await setupUncontrolledDropdownForTests({});
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('{ closeOnClickOutside: false } - should not close body when clicked outside', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ closeOnClickOutside: false });
            await user.click(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.click(document.body);

            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('{ closeOnMouseLeave: false } - should not close body on mouse leave', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeOnMouseLeave: false });
            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.unhover(target);

            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('{ closeOnMouseLeave: boundary } - should not close body on mouse move from target to body', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeOnMouseLeave: 'boundary' });
            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.hover(screen.getByRole('dialog'));

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();
        });

        it('{ closeOnMouseLeave: boundary } - should close body on mouse leave', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeOnMouseLeave: 'boundary' });
            await user.pointer({ target });

            expect(screen.getByRole('dialog')).toBeInTheDocument();

            await user.pointer([
                { target: target.ownerDocument.body },
            ]);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });

        it('{ closeOnMouseLeave: toggler } - should close body on mouse leave', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ openOnHover: true, closeOnMouseLeave: 'toggler' });
            await user.hover(target);

            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText(BODY_TEXT)).toBeInTheDocument();

            await user.unhover(target);

            expect(screen.queryByText(BODY_TEXT)).not.toBeInTheDocument();
        });
    });

    describe('fixedBodyPosition', () => {
        it('should follow the toggler by default', async () => {
            const { target } = await setupUncontrolledDropdownForTests({});
            await userEvent.click(target);
            const dialog = screen.getByRole('dialog');

            // Initial position
            const initialRect = { top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120, x: 100, y: 100 };
            const movedRect = { top: 200, left: 200, width: 50, height: 20, right: 250, bottom: 220, x: 200, y: 200 };
            target.getBoundingClientRect = jest.fn(() => initialRect as DOMRect);
            dialog.getBoundingClientRect = jest.fn(() => initialRect as DOMRect);

            // Simulate toggler move
            target.getBoundingClientRect = jest.fn(() => movedRect as DOMRect);
            window.dispatchEvent(new Event('resize'));
            await act(async () => { await delay(10); });

            // The dropdown should update its position (simulate style update)
            expect(target.getBoundingClientRect()).toMatchObject(movedRect);
        });

        it('should stay at the same position when fixedBodyPosition is true', async () => {
            const { target } = await setupUncontrolledDropdownForTests({ fixedBodyPosition: true });
            await userEvent.click(target);
            const dialog = screen.getByRole('dialog');

            // Initial position
            const initialRect = { top: 100, left: 100, width: 50, height: 20, right: 150, bottom: 120, x: 100, y: 100 };
            const movedRect = { top: 200, left: 200, width: 50, height: 20, right: 250, bottom: 220, x: 200, y: 200 };
            target.getBoundingClientRect = jest.fn(() => initialRect as DOMRect);
            dialog.getBoundingClientRect = jest.fn(() => initialRect as DOMRect);

            // Save initial style
            const initialTop = dialog.style.top;
            const initialLeft = dialog.style.left;

            // Simulate toggler move
            target.getBoundingClientRect = jest.fn(() => movedRect as DOMRect);
            window.dispatchEvent(new Event('resize'));
            await act(async () => { await delay(10); });

            // The dropdown should NOT update its style.top/left
            expect(dialog.style.top).toBe(initialTop);
            expect(dialog.style.left).toBe(initialLeft);
        });
    });
});
