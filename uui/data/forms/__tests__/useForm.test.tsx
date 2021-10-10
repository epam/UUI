import * as React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../useForm';
import { ContextProvider} from '../../..';
import { UseFormProps } from '..';
import { testSvc } from '@epam/test-utils';

describe('useForm', () => {
    beforeEach(jest.clearAllMocks);

    interface IFoo {
        dummy: string;
        tummy?: string;
    };

    const handleSave = async (save: () => void) => {
        try {
            return await act(save);
        } catch (err: unknown) {
            if (err !== undefined) throw err;
            return err;
        }
    }

    const testMetadata = { props: { dummy: { isRequired: true } } };
    const testData: IFoo = { dummy: '', tummy: '' };

    const getHookProps = async (props: UseFormProps<IFoo>) => {
        const wrapper = ({ children }) => (
            <ContextProvider onInitCompleted={ svc => Object.assign(testSvc, svc)}>
                { children }
            </ContextProvider>
        );
        const { waitForNextUpdate, rerender, result, ...rest } = renderHook(() => useForm<IFoo>(props), { wrapper });
        await waitForNextUpdate();
        return {
            result,
            rerender: (nextProps?: UseFormProps<IFoo>) => rerender({ ...props, children: undefined, ...nextProps }),
            waitForNextUpdate,
            ...rest
        };
    }

    it('Should return isChanged as true whenever the lens is changed', async () => {
        const { result } = await getHookProps({
            onSave: () => Promise.resolve(),
            onError: () => Promise.resolve(),
            value: testData,
            getMetadata: () => testMetadata
        });

        act(() => result.current.lens.prop('dummy').set('hello'));

        expect(result.current.isChanged).toBe(true);
        expect(result.current.value).toStrictEqual({ dummy: 'hello', tummy: '' });
    });

    it('Should correctly set isInvalid on form submit depending on the value', async () => {
        const onSaveSpy = jest.fn().mockResolvedValue(undefined);
        const { result } = await getHookProps({
            value: testData,
            onSave: onSaveSpy,
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        });

        await handleSave(result.current.save);
        expect(result.current.isInvalid).toBe(true)

        act(() => result.current.lens.prop("dummy").set("hello"));
        expect(result.current.isInvalid).toBe(false);

        await handleSave(result.current.save).then(() => expect(onSaveSpy).toHaveBeenCalled());
    });

    it('Should start validation on save and keep validation state valid values passed', async () => {
        const { result } = await getHookProps({
            value: testData,
            onSave: Promise.resolve,
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        });

        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.value.dummy).toBe('hello');
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

        act(() => result.current.lens.prop('dummy').set(''));
        expect(result.current.value.dummy).toBe('');
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

        await handleSave(result.current.save);
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(true);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
    });

    it('Should do nothing, if value isn`t changed', async () => {
        const saveMock = jest.fn().mockResolvedValue(false);
        const beforeLeaveMock = jest.fn().mockResolvedValue(false);

        const { result, rerender } = await getHookProps({
            value: testData,
            onSave: saveMock,
            onError: jest.fn(),
            beforeLeave: beforeLeaveMock,
            getMetadata: () => testMetadata,
        });

        rerender();

        expect(beforeLeaveMock).not.toHaveBeenCalled();
        expect(saveMock).not.toHaveBeenCalled();

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(result.current.isChanged).toBe(true);

        rerender();
        expect(result.current.isChanged).toBe(true);

        expect(beforeLeaveMock).not.toHaveBeenCalled();
        expect(saveMock).not.toHaveBeenCalled();
    });

    it('Should return isInvalid as false for 1 or more invalid fields', async () => {
        const enhancedMetadata = { ...testMetadata, props: { ...testMetadata.props, tummy: testMetadata.props.dummy } };
        const { result } = await getHookProps({
            value: testData,
            onSave: Promise.resolve,
            onError: jest.fn(),
            getMetadata: () => enhancedMetadata,
        });

        expect(result.current.isInvalid).toBe(false);

        await handleSave(result.current.save);
        expect(result.current.isInvalid).toBe(true);

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.isInvalid).toBe(true);
        act(() => result.current.lens.prop('tummy').set('hi'));
        expect(result.current.isInvalid).toBe(false);
    });

    it('Should show the same value, if you: save => leave => come back', async () => {
        const saveMock = jest.fn().mockResolvedValue({ form: {} });
        const beforeLeaveMock = jest.fn().mockResolvedValue(true);

        const { result, waitFor } = await getHookProps({
            value: testData,
            onSave: saveMock,
            beforeLeave: beforeLeaveMock,
            onError: jest.fn(),
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));

        expect(result.current.isChanged).toBe(true);
        await act(() => testSvc.uuiLocks.acquire(() => Promise.resolve()));
        waitFor(() => {
            expect(result.current.isInvalid).toBe(false);
            expect(beforeLeaveMock).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalled();
        })
    });

    it('Should undo to previous value, redo to the next value', async () => {
        const { result } = await getHookProps({
            value: testData,
            onSave: Promise.resolve,
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(result.current.isChanged).toBe(true);

        act(() => result.current.undo());
        expect(result.current.value.dummy).toBe(testData['dummy']);

        act(() => result.current.redo());
        expect(result.current.value.dummy).toBe('hi');
        expect(result.current.isChanged).toBe(true);
    });

    it('Should revert and load last passed value', async () => {
        const { result } = await getHookProps({
            value: testData,
            onSave: Promise.resolve,
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(result.current.isChanged).toBe(true);
        expect(result.current.value.dummy).toBe('hi');

        act(() => result.current.lens.prop('dummy').set('hello'));
        expect(result.current.value.dummy).toBe('hello');

        act(() => result.current.revert());
        expect(result.current.value.dummy).toBe(testData['dummy']);
    });

    it('Should have a lock on the first form change, release lock on save', async () => {
        const { result } = await getHookProps({
            value: testData,
            onSave: person => Promise.resolve({ form: person }),
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(result.current.isChanged).toBe(true);
        expect(testSvc.uuiLocks.getCurrentLock()).not.toBe(null);

        await handleSave(result.current.save);
        expect(testSvc.uuiLocks.getCurrentLock()).toBe(null);
    });

    it('Should call beforeLeave after component unmount', async () => {
        const beforeLeaveMock = jest.fn().mockResolvedValueOnce(true);
        const { result, unmount, waitFor } = await getHookProps({
            value: testData,
            onSave: data => Promise.resolve({ form: data }),
            beforeLeave: beforeLeaveMock,
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop("dummy").set("hi"));
        expect(result.current.isChanged).toBe(true);

        unmount();
        waitFor(() => {
            expect(beforeLeaveMock).toHaveBeenCalled();
        });
    });

    it('Should store unsaved data to localstorage', async () => {
        const settingsKey = 'form-test';
        const { result } = await getHookProps({
            value: testData,
            settingsKey,
            onSave: Promise.resolve,
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(testSvc.uuiUserSettings.get(settingsKey).dummy).toBe('hi');
        act(() => testSvc.uuiUserSettings.set(settingsKey, null));
    });

    it('Should clear unsaved data in localstorage after save', async () => {
        const settingsKey = 'form-test';
        const onSuccessSpy = jest.fn();
        const onErrorSpy = jest.fn();

        const { result } = await getHookProps({
            value: testData,
            settingsKey,
            onSave: data => Promise.resolve({ form: data }),
            beforeLeave: () => Promise.resolve(false),
            onSuccess: onSuccessSpy,
            onError: onErrorSpy,
            getMetadata: () => testMetadata,
        });

        act(() => result.current.lens.prop('dummy').set('hi'));
        expect(testSvc.uuiUserSettings.get(settingsKey).dummy).toBe('hi');

        await handleSave(result.current.save);
        expect(testSvc.uuiUserSettings.get(settingsKey)).toBe(null);
        expect(onSuccessSpy).toHaveBeenCalled();
    });

    it('Should call onError if onSave promise is rejected', async () => {
        const onSuccessSpy = jest.fn();
        const onErrorSpy = jest.fn();

        const { result, waitFor } = await getHookProps({
            value: testData,
            onSave: () => Promise.reject('Failed'),
            beforeLeave: () => Promise.resolve(false),
            onSuccess: onSuccessSpy,
            onError: onErrorSpy,
            getMetadata: () => testMetadata,
        });

        await handleSave(result.current.save);
        waitFor(() => {
            expect(onErrorSpy).toHaveBeenCalled();
        })
    });

    it('Should restore data from local storage after leaving form without saving changes', async () => {
        const settingsKey = 'form-test';
        const loadUnsavedChangesMock = jest.fn().mockImplementation(() => Promise.resolve());
        const props = {
            value: testData,
            settingsKey,
            onSave: data => Promise.resolve({ form: data }),
            beforeLeave: () => Promise.resolve(false),
            getMetadata: () => testMetadata,
        };

        const { result: firstRenderResult, unmount } = await getHookProps(props);

        act(() => firstRenderResult.current.lens.prop('dummy').set('hi'));

        unmount();

        const { result: secondRenderResult, waitForNextUpdate } = await getHookProps({
            ...props,
            loadUnsavedChanges: loadUnsavedChangesMock,
        });

        await waitForNextUpdate();

        expect(loadUnsavedChangesMock).toHaveBeenCalled();
        expect(secondRenderResult.current.lens.prop("dummy").get()).toBe("hi");
    });
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