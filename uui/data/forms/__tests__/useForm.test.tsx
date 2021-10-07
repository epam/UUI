import * as React from 'react';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { getUuiContexts, UuiContext } from '../../..';
import { testSvc } from '@epam/test-utils';
import { useForm } from '../useForm';

const wrapper = ({ children }) => (
    <UuiContext.Provider value={ getUuiContexts({
        onInitCompleted: svc => Object.assign(testSvc, svc)
    }) }>
        {children}
    </UuiContext.Provider>
);

describe.only('useForm', () => {
    beforeEach(jest.clearAllMocks);
    afterEach(cleanup);

    interface IFoo {
        dummy: string;
        tummy?: string;
    };

    const testData: IFoo = { dummy: '', tummy: '' };
    const testMetadata = { props: { dummy: { isRequired: true } } };

    it('Should return isChanged as true whenever the lens is changed', () => {
        const { result } = renderHook(() => useForm<IFoo>({
            value: testData,
            onSave: jest.fn(),
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        }), { wrapper });

        act(() => result.current.lens.prop('dummy').set('hello'));

        expect(result.current.isChanged).toBe(true);
        expect(result.current.value).toStrictEqual({ dummy: 'hello', tummy: '' });
    });

    it('Should correctly set isInvalid on form submit depending on the value', async () => {
        const onSaveSpy = jest.fn().mockResolvedValue(undefined);
        const { result } = renderHook(() => useForm<IFoo>({
            value: testData,
            onSave: onSaveSpy,
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        }), { wrapper });

        await act(result.current.save);
        expect(result.current.isInvalid).toBe(true);

        act(() => result.current.lens.prop("dummy").set("hello"));
        expect(result.current.isInvalid).toBe(false);

        await act(result.current.save);
        expect(onSaveSpy).toHaveBeenCalled();
    });

    it('Should start validation on save and keep validation state valid values passed', async () => {
        const { result, waitFor } = renderHook(() => useForm<IFoo>({
            value: testData,
            onSave: Promise.resolve,
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        }), { wrapper });

        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
        expect(result.current.isInvalid).toBe(false);

        act(() => result.current.lens.prop('dummy').set(''));
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
        expect(result.current.isInvalid).toBe(false);

        act(() => result.current.save());
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(true);
        expect(result.current.isInvalid).toBe(true);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
        expect(result.current.isInvalid).toBe(false);
    });

    it('Should do nothing, if value isn`t changed', () => {
        const saveMock = jest.fn().mockResolvedValue(false);
        const beforeLeaveMock = jest.fn().mockResolvedValue(false);
        const props = {
            value: testData,
            onSave: saveMock,
            onError: jest.fn(),
            beforeLeave: beforeLeaveMock,
            getMetadata: () => testMetadata,
            children: undefined,
        };

        const { result, rerender } = renderHook(() => useForm<IFoo>(props), { wrapper });

        rerender(props);

        expect(beforeLeaveMock).not.toHaveBeenCalled();
        expect(saveMock).not.toHaveBeenCalled();

        result.current.lens.prop('dummy').set('hi');
        expect(result.current.isChanged).toBe(true);

        rerender(props);
        expect(result.current.isChanged).toBe(true);

        expect(beforeLeaveMock).not.toHaveBeenCalled();
        expect(saveMock).not.toHaveBeenCalled();
    });

    it('Should return isInvalid as false for 1 or more invalid fields', async () => {
        const enhancedMetadata = { ...testMetadata, props: { ...testMetadata.props, tummy: testMetadata.props.dummy } };
        const { result } = renderHook(() => useForm<IFoo>({
            value: testData,
            onSave: Promise.resolve,
            onError: jest.fn(),
            getMetadata: () => enhancedMetadata,
        }), { wrapper });

        expect(result.current.isInvalid).toBe(false);

        await act(result.current.save);
        expect(result.current.isInvalid).toBe(true);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.isInvalid).toBe(true);
        act(() => result.current.lens.prop('tummy').set('hi'));
        expect(result.current.isInvalid).toBe(false);
    });

    it('Should show the same value, if you: save => leave => come back', async () => {
        const saveMock = jest.fn().mockResolvedValue(false);
        const beforeLeaveMock = jest.fn().mockResolvedValue(false);

        const { result } = renderHook(() => useForm<IFoo>({
            value: testData,
            onSave: saveMock,
            beforeLeave: beforeLeaveMock,
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        }), { wrapper });

        act(() => result.current.lens.prop('dummy').set('hi'));

        expect(result.current.isChanged).toBe(true)
        expect(result.current.isInvalid).toBe(false);
        expect(beforeLeaveMock).toHaveBeenCalled()
        expect(saveMock).toHaveBeenCalled();
        console.log(result.current)
    });

    it('Should undo to previous value, redo to the next value', () => {});
    it('Should revert and load last passed value', () => {});
    it('Should have a lock on the first form change, release lock on save', () => {});
    it('Should call beforeLeave after component unmount', () => {});
    it('Should store unsaved data to localstorage', () => {});
    it('Should clear unsaved data in localstorage after save', () => {});
    it('Should call onError if onSave promise is rejected', () => {});
    it('Should restore data from local storage after leaving form without saving changes', () => {});
});

describe('useForm server validation', () => {
    interface IAdvancedFoo {
        dummy: string;
        deep: { inner: string };
        deep2?: { inner2: string };
    }

    it('Should correctly handle server validation', () => {});
    it('Should keep server error notification until field is changed', () => {});
    it('Should keep only validationProps tree with validationMessage in the end', () => {});
});