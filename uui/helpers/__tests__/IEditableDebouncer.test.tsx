import React from 'react';
import { act } from "react-dom/test-utils";
import { mountWithContextAsync, mountWrappedComponentAsync } from "@epam/test-utils";
import { IEditable } from '../../types';
import { IEditableDebouncer } from '../IEditableDebouncer';

describe('IEditableDebouncer', () => {
    it('should call onValueChanged synchronously, if disableDebounce = true', async () => {
        const outerOnValueChange = jest.fn();
        let lastRenderProps: IEditable<number> = null;
        await mountWithContextAsync(
            <IEditableDebouncer
                value={ 1 }
                onValueChange={ outerOnValueChange }
                render={ (props) => {
                    lastRenderProps = props;
                    return null;
                } }
                disableDebounce={ true }
            />,
        );

        act(() => lastRenderProps.onValueChange(2));
        expect(lastRenderProps.value).toBe(2);
        expect(outerOnValueChange).toBeCalledWith(2);
    });

    it('should call onValueChanged delayed', async done => {
        const outerOnValueChange = jest.fn();
        let lastRenderProps: IEditable<number> = null;
        await mountWithContextAsync(
            <IEditableDebouncer
                value={ 1 }
                onValueChange={ outerOnValueChange }
                render={ (props) => {
                    lastRenderProps = props;
                    return null;
                } }
                debounceDelay={ 100 }
            />,
        );

        act(() => lastRenderProps.onValueChange(2));

        expect(lastRenderProps.value).toBe(2);
        expect(outerOnValueChange).not.toBeCalled();

        setTimeout(() => {
            expect(lastRenderProps.value).toBe(2);
            expect(outerOnValueChange).not.toBeCalled();
        }, 1);

        setTimeout(() => {
            expect(lastRenderProps.value).toBe(2);
            expect(outerOnValueChange).toBeCalledWith(2);
            done();
        }, 1000);
    });

    it('should change inner value immediately if outer value is changed outside', async () => {
        const outerOnValueChange = jest.fn(() => {
        });
        let lastRenderProps: IEditable<number> = null;

        const component = await mountWrappedComponentAsync(IEditableDebouncer, {
            value: 1,
            onValueChange: outerOnValueChange,
            render: (props: IEditable<number>): null => {
                lastRenderProps = props;
                return null;
            },
            debounceDelay: 5,
        });

        act(() => lastRenderProps.onValueChange(3));
        component.setProps({ value: 2 });
        expect(lastRenderProps.value).toBe(2);
    });
});