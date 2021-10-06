import * as React from 'react';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { getUuiContexts, UuiContext } from '../../..';
import { useForm } from '../useForm';

describe.only('useForm', () => {
    let testSvc = {};

    beforeEach(jest.clearAllMocks);
    afterEach(() => {
        cleanup();
        testSvc = {};
    });

    interface IFoo {
        dummy: string;
        tummy?: string;
    };

    const uuiLocksAcquire = jest.fn();
    const uuiLocksRelease = jest.fn();
    const uuiLocksWithLock = jest.fn();

    const uuiUserSettingsGet = jest.fn();
    const uuiUserSettingsSet = jest.fn();

    const wrapper = ({ children }) => (
        <UuiContext.Provider value={
            getUuiContexts({
                onInitCompleted: svc => Object.assign(testSvc, {
                    ...svc,
                    uuiLocks: {
                        ...svc.uuiLocks,
                        acquire: uuiLocksAcquire,
                        release: uuiLocksRelease,
                        withLock: uuiLocksWithLock
                    },
                    uuiUserSettings: {
                        ...svc.uuiUserSettings,
                        get: uuiUserSettingsGet,
                        set: uuiUserSettingsSet
                    },
                })
            })
        }>
            {children}
        </UuiContext.Provider>
    );

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
        const onSaveSpy: any = jest.fn(x => Promise.resolve(x));
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

        await act(result.current.save);
        waitFor(() => expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(true));
        expect(result.current.isInvalid).toBe(true);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
        expect(result.current.isInvalid).toBe(false);
    });

    it('Should do nothing, if value isn`t changed', () => {});
    it('Should return isInvalid as false for 1 and more invalid fields', () => {});
    it('Should show the same value, if you: save => leave => come back', () => {});
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