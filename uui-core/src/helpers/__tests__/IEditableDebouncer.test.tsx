import React from 'react';
import { renderWithContextAsync, act } from '@epam/uui-test-utils';
import { IEditable } from '../../types';
import { IEditableDebouncer } from '../IEditableDebouncer';

describe('IEditableDebouncer', () => {
    it('should call onValueChanged synchronously, if disableDebounce = true', async () => {
        const initialValue = 1;
        const newValue = 2;
        const outerOnValueChange = jest.fn();
        let lastRenderProps: IEditable<number> = null;
        await renderWithContextAsync(
            <IEditableDebouncer
                value={ initialValue }
                onValueChange={ outerOnValueChange }
                render={ (props) => {
                    lastRenderProps = props;
                    return null;
                } }
                disableDebounce={ true }
            />,
        );

        act(() => lastRenderProps.onValueChange(newValue));
        expect(lastRenderProps.value).toBe(newValue);
        expect(outerOnValueChange).toBeCalledWith(newValue);
    });

    it('should call onValueChanged delayed', async () => {
        const initialValue = 1;
        const newValue = 2;
        const outerOnValueChange = jest.fn();
        let lastRenderProps: IEditable<number> = null;
        await renderWithContextAsync(
            <IEditableDebouncer
                value={ initialValue }
                onValueChange={ outerOnValueChange }
                render={ (props) => {
                    lastRenderProps = props;
                    return null;
                } }
                debounceDelay={ 100 }
            />,
        );
        jest.useFakeTimers();

        act(() => lastRenderProps.onValueChange(newValue));
        expect(outerOnValueChange).not.toBeCalled();

        jest.runOnlyPendingTimers();
        jest.useRealTimers();

        expect(lastRenderProps.value).toBe(newValue);
        expect(outerOnValueChange).toBeCalledWith(newValue);
    });

    it('should change inner value immediately if outer value is changed outside', async () => {
        const outerOnValueChange = jest.fn(() => {});
        let lastRenderProps: IEditable<number> = null;
        const props = {
            value: 1,
            onValueChange: outerOnValueChange,
            render: (propsInner: IEditable<number>): null => {
                lastRenderProps = propsInner;
                return null;
            },
            debounceDelay: 5,
        };
        const result = await renderWithContextAsync(<IEditableDebouncer { ...props } />);
        act(() => lastRenderProps.onValueChange(3));

        result.rerender(<IEditableDebouncer { ...props } value={ 2 } />);
        expect(lastRenderProps.value).toBe(2);
    });
});
