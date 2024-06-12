import React from 'react';
import { Slider, SliderProps } from '../Slider';
import { setupComponentForTest, userEvent, screen, act } from '@epam/uui-test-utils';

async function setupSlider(params: Partial<SliderProps>) {
    const { mocks, setProps } = await setupComponentForTest<SliderProps>(
        (context) => ({
            value: params.value,
            onValueChange: params.onValueChange || jest.fn().mockImplementation((newValue) => {
                context.current.setProperty('value', newValue);
            }),
            min: 0,
            max: 100,
            step: 1,
            ...params,
        }),
        (props) => {
            return <Slider { ...props } />;
        },
    );
    return { setProps, mocks };
}

describe('Slider', () => {
    it('sets the initial value', async () => {
        await setupSlider({ value: 50 });
        const slider = screen.getByRole('slider');
        expect(slider.getAttribute('aria-valuenow')).toEqual('50');
    });

    it('changes the value when clicked', async () => {
        const setup = await setupSlider({ value: 50 });
        const slider = screen.getByRole('slider');
        act(() => slider.click());
        expect(setup.mocks.onValueChange).toHaveBeenCalled();
    });

    it('should call onValueChange on keyboard click', async () => {
        const setup = await setupSlider({ value: 50 });
        const slider = screen.getByRole('slider');

        await userEvent.type(slider, '{arrowright}');
        expect(setup.mocks.onValueChange).toHaveBeenCalled();

        await userEvent.type(slider, '{arrowleft}');
        expect(setup.mocks.onValueChange).toHaveBeenCalled();
    });

    it('should have class `uui-disabled` when `isDisabled` is true', async () => {
        await setupSlider({ value: 50, isDisabled: true });
        const slider = screen.getByRole('slider').parentElement;
        expect(slider).toHaveClass('uui-disabled');
    });
});
