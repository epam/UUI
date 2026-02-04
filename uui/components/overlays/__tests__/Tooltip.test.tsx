import React from 'react';
import { Tooltip, TooltipProps } from '../Tooltip';
import { renderSnapshotWithContextAsync, setupComponentForTest, screen, userEvent, act, delay, waitFor } from '@epam/uui-test-utils';
import { Button } from '../../buttons';
import { shift } from '@floating-ui/react';

type TestParams = Partial<TooltipProps>;

const TARGET_TEXT = 'Hover me';
const TOOLTIP_CONTENT = 'Tooltip content';

async function setupTooltipForTests(params: TestParams) {
    const { result, setProps, mocks } = await setupComponentForTest<TooltipProps>(
        () => ({
            content: TOOLTIP_CONTENT,
            children: <Button caption={ TARGET_TEXT } />,
            ...params,
        }),
        (props) => (
            <Tooltip { ...props } />
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

async function hoverAndVerifyTooltipOpens(target: HTMLElement, userInstance: ReturnType<typeof userEvent.setup>) {
    await userInstance.hover(target);
    expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
}

async function unhoverAndVerifyTooltipCloses(target: HTMLElement, userInstance: ReturnType<typeof userEvent.setup>) {
    await userInstance.unhover(target);
    await waitFor(() => {
        expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
    });
}

describe('Tooltip', () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(() => {
        user = userEvent.setup();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Tooltip>Test</Tooltip>);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Tooltip color="neutral" content="Test">
                Test
            </Tooltip>,
        );

        expect(tree).toMatchSnapshot();
    });

    describe('Basic functionality', () => {
        it('should not render tooltip when no content is provided', async () => {
            await setupTooltipForTests({ content: undefined, renderContent: undefined });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
        });

        it('should render tooltip with content prop', async () => {
            await setupTooltipForTests({ content: TOOLTIP_CONTENT });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
        });

        it('should render tooltip with renderContent function', async () => {
            const renderContent = jest.fn(() => TOOLTIP_CONTENT);
            await setupTooltipForTests({ renderContent, content: undefined });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
            expect(renderContent).toHaveBeenCalled();
        });

        it('should prioritize content over renderContent when both are provided', async () => {
            const renderContent = jest.fn(() => 'Render content');
            await setupTooltipForTests({ content: TOOLTIP_CONTENT, renderContent });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
            expect(screen.queryByText('Render content')).not.toBeInTheDocument();
        });
    });

    describe('Hover interactions', () => {
        it('should open tooltip on hover', async () => {
            await setupTooltipForTests({});
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
        });

        it('should close tooltip on mouse leave (default behavior)', async () => {
            const { target } = await setupTooltipForTests({});
            await hoverAndVerifyTooltipOpens(target, user);
            await unhoverAndVerifyTooltipCloses(target, user);
        });

        it('should not close tooltip on mouse leave when closeOnMouseLeave is false', async () => {
            const { target } = await setupTooltipForTests({ closeOnMouseLeave: false });
            await user.hover(target);

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();

            await user.unhover(target);

            // Tooltip should still be visible
            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
        });

        it('should close tooltip on mouse leave when closeOnMouseLeave is toggler', async () => {
            const { target } = await setupTooltipForTests({ closeOnMouseLeave: 'toggler' });
            await hoverAndVerifyTooltipOpens(target, user);
            await unhoverAndVerifyTooltipCloses(target, user);
        });
    });

    describe('Keyboard interactions', () => {
        it('should close tooltip on Escape key press (default)', async () => {
            const { target } = await setupTooltipForTests({});
            await user.hover(target);

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();

            await user.keyboard('{Escape}');

            await waitFor(() => {
                expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
            });
        });

        it('should not close tooltip on Escape when closeOnEscape is false', async () => {
            const { target } = await setupTooltipForTests({ closeOnEscape: false });
            await user.hover(target);

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();

            await user.keyboard('{Escape}');

            // Tooltip should still be visible
            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
        });
    });

    describe('Color variants', () => {
        it('should apply neutral color', async () => {
            await setupTooltipForTests({ color: 'neutral' });
            await user.hover(screen.getByText(TARGET_TEXT));

            const tooltip = screen.getByRole('tooltip', { hidden: true }).closest('[class*="uui-color-neutral"]');
            expect(tooltip).toBeInTheDocument();
        });

        it('should apply inverted color (default)', async () => {
            await setupTooltipForTests({});
            await user.hover(screen.getByText(TARGET_TEXT));

            const tooltip = screen.getByRole('tooltip', { hidden: true }).closest('[class*="uui-color-inverted"]');
            expect(tooltip).toBeInTheDocument();
        });

        it('should apply critical color', async () => {
            await setupTooltipForTests({ color: 'critical' });
            await user.hover(screen.getByText(TARGET_TEXT));

            const tooltip = screen.getByRole('tooltip', { hidden: true }).closest('[class*="uui-color-critical"]');
            expect(tooltip).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        it('should apply custom maxWidth', async () => {
            const maxWidth = 500;
            await setupTooltipForTests({ maxWidth });
            await user.hover(screen.getByText(TARGET_TEXT));

            const tooltip = screen.getByRole('tooltip', { hidden: true });
            const tooltipContainer = tooltip.parentElement;
            expect(tooltipContainer).toHaveStyle({ maxWidth: `${maxWidth}px` });
        });

        it('should use default maxWidth when not provided', async () => {
            await setupTooltipForTests({});
            await user.hover(screen.getByText(TARGET_TEXT));

            const tooltip = screen.getByRole('tooltip', { hidden: true });
            const tooltipContainer = tooltip.parentElement;
            expect(tooltipContainer).toHaveStyle({ maxWidth: '300px' });
        });

        it('should handle placement prop', async () => {
            await setupTooltipForTests({ placement: 'bottom' });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
        });

        it('should handle auto placement', async () => {
            await setupTooltipForTests({ placement: 'auto' });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
        });

        it('should handle object format for offset prop { mainAxis, crossAxis }', async () => {
            await setupTooltipForTests({ offset: { mainAxis: 20, crossAxis: 10 } });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
        });

        it('should handle array format with undefined values using default destructuring', async () => {
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            await setupTooltipForTests({ offset: [undefined, undefined] as any });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();

            consoleErrorSpy.mockRestore();
        });

        it('should merge custom middleware with default middleware', async () => {
            const customMiddleware = [shift({ padding: 10 })];
            await setupTooltipForTests({ middleware: customMiddleware });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
        });

        it('should use only default middleware when no custom middleware is provided', async () => {
            await setupTooltipForTests({});
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText(TOOLTIP_CONTENT)).toBeInTheDocument();
        });
    });

    describe('Delays', () => {
        it('should respect openDelay', async () => {
            const openDelay = 200;
            const { target } = await setupTooltipForTests({ openDelay });

            await user.hover(target);

            expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();

            await act(async () => {
                await delay(openDelay);
            });

            await waitFor(() => {
                expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            });
        });

        it('should respect closeDelay', async () => {
            const closeDelay = 200;
            const { target } = await setupTooltipForTests({ closeDelay });
            await user.hover(target);

            await waitFor(() => {
                expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            });

            await user.unhover(target);

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();

            await act(async () => {
                await delay(closeDelay);
            });

            await waitFor(() => {
                expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
            });
        });
    });

    describe('Controlled mode', () => {
        it('should be controlled by value prop', async () => {
            const onValueChange = jest.fn();
            const { setProps } = await setupTooltipForTests({ value: false, onValueChange });

            expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();

            setProps({ value: true });

            await waitFor(() => {
                expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            });

            setProps({ value: false });

            await waitFor(() => {
                expect(screen.queryByRole('tooltip', { hidden: true })).not.toBeInTheDocument();
            });
        });

        it('should call onValueChange when opening', async () => {
            const onValueChange = jest.fn();
            const { target } = await setupTooltipForTests({ value: false, onValueChange });

            await user.hover(target);

            await waitFor(() => {
                expect(onValueChange).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('Children handling', () => {
        it('should handle single child', async () => {
            await setupTooltipForTests({
                children: <Button caption={ TARGET_TEXT } />,
            });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
        });

        it('should handle multiple children', async () => {
            await setupTooltipForTests({
                children: [
                    <Button key="1" caption={ TARGET_TEXT } />,
                    <span key="2">Additional content</span>,
                ],
            });
            await user.hover(screen.getByText(TARGET_TEXT));

            expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            expect(screen.getByText('Additional content')).toBeInTheDocument();
        });
    });

    describe('onClose callback', () => {
        it('should call onClose when tooltip closes', async () => {
            const onClose = jest.fn();
            const { target } = await setupTooltipForTests({ onClose });
            await user.hover(target);

            await waitFor(() => {
                expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
            });
        });
    });
});
