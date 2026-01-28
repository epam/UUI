import React from 'react';
import { renderSnapshotWithContextAsync, setupComponentForTest, screen, waitFor, act } from '@epam/uui-test-utils';
import { SliderRating, SliderRatingProps } from '../SliderRating';

async function setupSliderRating(params: Partial<SliderRatingProps<number>>) {
    const { mocks, setProps } = await setupComponentForTest<SliderRatingProps<number>>(
        (context) => ({
            value: params.value ?? 3,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                if (context.current) {
                    context.current.setProperty('value', newValue);
                }
            }),
            ...params,
        }),
        (props) => {
            return <SliderRating { ...props } />;
        },
    );
    return { setProps, mocks };
}

describe('SliderRating', () => {
    it('should be rendered correctly with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with value 0 (NotAvailable)', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 0 } onValueChange={ jest.fn() } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly in readonly mode', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 4 } onValueChange={ jest.fn() } isReadonly={ true } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly in disabled mode', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 2 } onValueChange={ jest.fn() } isDisabled={ true } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with size 24', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } size="24" />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with from=2', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } from={ 2 } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly without NotAvailable option', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } withoutNa={ true } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with custom renderTooltip', async () => {
        const customTooltip = (value: number) => `Rating: ${value}`;
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } renderTooltip={ customTooltip } />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with tooltipColor', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 3 } onValueChange={ jest.fn() } tooltipColor="fire" />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with all props', async () => {
        const customTooltip = (value: number) => `Custom: ${value}`;
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating
                value={ 4 }
                onValueChange={ jest.fn() }
                size="24"
                from={ 1 }
                tooltipColor="gray"
                renderTooltip={ customTooltip }
                isReadonly={ false }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with readonly and value 0', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <SliderRating value={ 0 } onValueChange={ jest.fn() } isReadonly={ true } />,
        );
        expect(tree).toMatchSnapshot();
    });

    describe('Tooltip behavior in readonly mode', () => {
        it('should show tooltip with correct dot value when hovering over a dot', async () => {
            const customTooltip = jest.fn((value: number) => `Dot ${value}`);
            await setupSliderRating({
                value: 3,
                isReadonly: true,
                renderTooltip: customTooltip,
            });

            const slider = screen.getByRole('slider');
            const tooltipBox = slider.querySelector('[class*="tooltipsBox"]');

            expect(tooltipBox).toBeInTheDocument();

            // Simulate mouse move over first dot (value 1)
            const rect = tooltipBox!.getBoundingClientRect();
            const mouseEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: rect.left + 10, // Approximate position for dot 1
            });
            act(() => {
                tooltipBox!.dispatchEvent(mouseEvent);
            });

            await waitFor(() => {
                expect(customTooltip).toHaveBeenCalled();
            });
        });
    });

    describe('Edge cases', () => {
        it('should handle from=2 correctly', async () => {
            const tree = await renderSnapshotWithContextAsync(
                <SliderRating value={ 3 } onValueChange={ jest.fn() } from={ 2 } isReadonly={ true } />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
