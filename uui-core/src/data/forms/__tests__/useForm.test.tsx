import { useForm } from '../useForm';
import type { Metadata, ValidationMode } from '../../../../index';
import type { FormSaveResponse, IFormApi, UseFormProps } from '../index';
import { renderHookWithContextAsync, act, getDefaultUUiContextWrapper } from '@epam/uui-test-utils';

async function handleSave(save: () => void) {
    try {
        return await act(save);
    } catch (err: unknown) {
        if (err !== undefined) throw err;
        return err;
    }
}

interface IFoo {
    dummy: string;
    tummy?: string;
}

const testMetadata = { props: { dummy: { isRequired: true } } };
const testData: IFoo = { dummy: '', tummy: '' };

describe('useForm', () => {
    beforeEach(jest.clearAllMocks);
    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Basic updates handing', () => {
        it('Should update form value with onValueChange', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<string>, IFormApi<string>>(() =>
                useForm({
                    onSave: () => Promise.resolve(),
                    onError: () => Promise.resolve(),
                    value: 'a',
                }));

            act(() => result.current.onValueChange('b'));
            expect(result.current.value).toBe('b');
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (plain value)', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<string>, IFormApi<string>>(() =>
                useForm({
                    onSave: () => Promise.resolve(),
                    onError: () => Promise.resolve(),
                    value: 'a',
                }));

            act(() => result.current.setValue('b'));
            expect(result.current.value).toBe('b');
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (callback)', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<number>, IFormApi<number>>(() =>
                useForm({
                    onSave: () => Promise.resolve(),
                    onError: () => Promise.resolve(),
                    value: 1,
                }));

            act(() => result.current.setValue((x) => x + 1));
            expect(result.current.value).toBe(2);
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (callback, 2 immediate updates)', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<number>, IFormApi<number>>(() =>
                useForm({
                    onSave: () => Promise.resolve(),
                    onError: () => Promise.resolve(),
                    value: 1,
                }));

            act(() => {
                result.current.setValue((x) => x + 1);
                result.current.setValue((x) => x + 1);
            });
            expect(result.current.value).toBe(3);
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('should update form value by external props.value change', async () => {
            const { result, rerender } = await renderHookWithContextAsync<UseFormProps<number>, IFormApi<number>>((props) => useForm(props), {
                onSave: () => Promise.resolve(),
                value: 1,
            });

            act(() => result.current.setValue(2));
            expect(result.current.value).toBe(2);
            rerender({
                onSave: () => Promise.resolve(),
                value: 3,
            });

            expect(result.current.value).toBe(3);
        });
    });

    describe('Client validation', () => {
        it('Should return isChanged as true whenever the lens is changed', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm({
                    onSave: () => Promise.resolve(),
                    onError: () => Promise.resolve(),
                    value: testData,
                    getMetadata: () => testMetadata,
                }));

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isChanged).toBe(true);
            expect(result.current.value).toStrictEqual({ dummy: 'hello', tummy: '' });
        });

        it('Should correctly set isInvalid on form submit depending on the value', async () => {
            const onSaveSpy = jest.fn().mockResolvedValue(undefined);
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: onSaveSpy,
                    onError: jest.fn(),
                    getMetadata: () => testMetadata,
                }));

            await handleSave(result.current.save);
            expect(result.current.isInvalid).toBe(true);

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isChanged).toBe(true);

            await act(() => handleSave(result.current.save));
            expect(result.current.value).toStrictEqual({ dummy: 'hello', tummy: '' });
            expect(onSaveSpy).toHaveBeenCalled();
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should start validation on save and keep validation state valid values passed', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: Promise.resolve,
                    beforeLeave: () => Promise.resolve(false),
                    getMetadata: () => testMetadata,
                }));

            expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.value.dummy).toBe('hello');
            expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

            act(() => result.current.lens.prop('dummy').set(''));
            expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);

            await handleSave(result.current.save);
            expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(true);

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.lens.prop('dummy').toProps().isInvalid).toBe(false);
        });

        it('Should return isInvalid as false for 1 or more invalid fields', async () => {
            const enhancedMetadata = { ...testMetadata, props: { ...testMetadata.props, tummy: testMetadata.props.dummy } };
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: Promise.resolve,
                    onError: jest.fn(),
                    getMetadata: () => enhancedMetadata,
                }));

            expect(result.current.isInvalid).toBe(false);

            await handleSave(result.current.save);
            expect(result.current.isInvalid).toBe(true);

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isInvalid).toBe(true);
            act(() => result.current.lens.prop('tummy').set('hi'));
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should validate all fields when call save action in validateOn: "change" mode', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: { dummy: 'hello' },
                    onSave: (form) => Promise.resolve({ form: form }),
                    onError: jest.fn(),
                    getMetadata: () => ({ props: { dummy: { isRequired: true }, tummy: { isRequired: true } } }),
                    validationOn: 'change',
                }));

            act(() => result.current.lens.prop('dummy').set(null));
            expect(result.current.validationProps).toStrictEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: 'The field is mandatory',
                },
                tummy: {
                    isInvalid: false,
                },
            });

            await handleSave(result.current.save);

            expect(result.current.lens.toProps().validationProps).toStrictEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: 'The field is mandatory',
                },
                tummy: {
                    isInvalid: true,
                    validationMessage: 'The field is mandatory',
                },
            });
        });

        it('Should allow to replace getMetadata prop', async () => {
            const props = {
                value: { dummy: 'test' },
                onSave: (form) => Promise.resolve({ form }),
                onError: jest.fn(),
                getMetadata: () => ({}),
                validationOn: 'change' as ValidationMode,
            };

            const { result, rerender } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useForm<IFoo>, props);

            act(() => result.current.lens.prop('dummy').set(''));

            // The form is valid, as there's nothing in metadata
            expect(result.current.isInvalid).toEqual(false);

            // Update the getMetadata callback so 'dummy' is now required
            rerender({
                ...props,
                getMetadata: () => ({ props: { dummy: { isRequired: true } } }),
            });

            act(() => result.current.lens.prop('dummy').set(' '));

            // We haven't changed the form value, however with the new getMetadata is should be invalid
            expect(result.current.isInvalid).toEqual(true);

            expect(result.current.validationProps).toEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: 'The field is mandatory',
                },
            });
        });

        it('Should validate form by calling validate callback', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: () => Promise.resolve(),
                    onError: jest.fn(),
                    getMetadata: () => testMetadata,
                }));

            const validationState = await act(() => result.current.validate());

            expect(validationState.isInvalid).toBe(true);

            act(() => result.current.lens.prop('dummy').set('hello'));

            expect(result.current.isInvalid).toBe(false);
        });
    });

    describe('isChanged, redo/undo/revert handing', () => {
        it('Should set isChange=false after form saved', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: (form) => Promise.resolve({ form: form }),
                    onError: jest.fn(),
                    getMetadata: () => testMetadata,
                }));

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isChanged).toBe(true);

            await act(() => handleSave(result.current.save));

            expect(result.current.isChanged).toBe(false);
        });

        it('Should set isChange=false when fromValue equal initialValue', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: (form) => Promise.resolve({ form: form }),
                    onError: jest.fn(),
                    getMetadata: () => testMetadata,
                }));

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isChanged).toBe(true);

            act(() => result.current.lens.prop('dummy').set(''));

            expect(result.current.isChanged).toBe(false);
        });

        it('Should undo to previous value, redo to the next value', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: Promise.resolve,
                    beforeLeave: () => Promise.resolve(false),
                    getMetadata: () => testMetadata,
                }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            act(() => result.current.undo());
            expect(result.current.value.dummy).toBe(testData.dummy);

            act(() => result.current.redo());
            expect(result.current.value.dummy).toBe('hi');
            expect(result.current.isChanged).toBe(true);
        });

        it('Should revert and load last passed value', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm<IFoo>({
                    value: testData,
                    onSave: Promise.resolve,
                    beforeLeave: () => Promise.resolve(false),
                    getMetadata: () => testMetadata,
                }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
            expect(result.current.value.dummy).toBe('hi');

            act(() => result.current.revert());
            expect(result.current.value).toBe(testData);
            expect(result.current.isChanged).toBe(false);
        });

        it('Should revert to the last saved value', async () => {
            const props: UseFormProps<IFoo> = {
                value: testData,
                onSave: async () => {},
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            };

            const { result, rerender } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>(props));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
            expect(result.current.value.dummy).toBe('hi');

            await act(async () => result.current.save());
            rerender(props);

            act(() => result.current.lens.prop('dummy').set('hi again'));

            act(() => result.current.revert());
            expect(result.current.value.dummy).toBe('hi');
            expect(result.current.isChanged).toBe(false);
        });

        it('Should clear undo buffer after save', async () => {
            const props: UseFormProps<IFoo> = {
                value: testData,
                onSave: async (value) => {
                    props.value = value;
                },
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            };

            const { result, rerender } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>(props));

            act(() => result.current.lens.prop('dummy').set('hi'));
            await act(async () => result.current.save());
            rerender(props);
            expect(result.current.isChanged).toBe(false);
            expect(result.current.canUndo).toBe(false);
            expect(result.current.canRedo).toBe(false);

            act(() => result.current.lens.prop('dummy').set('hi again'));
            expect(result.current.isChanged).toBe(true);
            expect(result.current.canUndo).toBe(true);
            expect(result.current.canRedo).toBe(false);

            act(() => result.current.undo());
            expect(result.current.isChanged).toBe(false);
            expect(result.current.canUndo).toBe(false);
            expect(result.current.canRedo).toBe(true);
            expect(result.current.value.dummy).toBe('hi');

            act(() => result.current.redo());
            expect(result.current.isChanged).toBe(true);
            expect(result.current.canUndo).toBe(true);
            expect(result.current.canRedo).toBe(false);
            expect(result.current.value.dummy).toBe('hi again');
        });

        it('Should allow to replaceValue', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<string>, IFormApi<string>>(() =>
                useForm<string>({
                    value: 'a',
                    onSave: (form) => Promise.resolve({ form: form }),
                    onError: jest.fn(),
                }));

            act(() => result.current.replaceValue('b'));
            expect(result.current.value).toBe('b');
            expect(result.current.isChanged).toBe(false);
            expect(result.current.canUndo).toBe(false);
            expect(result.current.canRedo).toBe(false);

            act(() => result.current.setValue('c'));
            act(() => result.current.replaceValue('d'));
            expect(result.current.value).toBe('d');
            expect(result.current.isChanged).toBe(true);
            expect(result.current.canUndo).toBe(true);
            expect(result.current.canRedo).toBe(false);

            await act(() => handleSave(result.current.save));
            expect(result.current.isChanged).toBe(false);
        });

        it('Should have a lock on the first form change, release lock on save', async () => {
            const { wrapper } = getDefaultUUiContextWrapper();
            const useFormHook = () => useForm({
                value: testData,
                onSave: (person) => Promise.resolve({ form: person }),
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            });
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useFormHook, undefined, { wrapper });

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
        });

        it('Should store unsaved data to localstorage', async () => {
            const settingsKey = 'form-test';
            const { wrapper, testUuiCtx } = getDefaultUUiContextWrapper();
            const useFormHook = () =>
                useForm<IFoo>({
                    value: testData,
                    settingsKey,
                    onSave: Promise.resolve,
                    beforeLeave: () => Promise.resolve(false),
                    getMetadata: () => testMetadata,
                });
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useFormHook, undefined, { wrapper });

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testUuiCtx.uuiUserSettings.get<IFoo>(settingsKey).dummy).toBe('hi');
            act(() => testUuiCtx.uuiUserSettings.set<IFoo>(settingsKey, null));
        });

        it('Should clear unsaved data in localstorage after save', async () => {
            const settingsKey = 'form-test';
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { wrapper, testUuiCtx } = getDefaultUUiContextWrapper();
            const useFormHook = () =>
                useForm({
                    value: testData,
                    settingsKey,
                    onSave: (data) => Promise.resolve({ form: data }),
                    beforeLeave: () => Promise.resolve(false),
                    onSuccess: onSuccessSpy,
                    onError: onErrorSpy,
                    getMetadata: () => testMetadata,
                });
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useFormHook, undefined, { wrapper });

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testUuiCtx.uuiUserSettings.get<IFoo>(settingsKey).dummy).toBe('hi');

            await act(() => handleSave(result.current.save));
            expect(testUuiCtx.uuiUserSettings.get<IFoo>(settingsKey)).toBe(null);
            expect(onSuccessSpy).toHaveBeenCalled();
        });

        it('Should call onError if onSave promise is rejected', async () => {
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm({
                    value: { ...testData, dummy: 'hi' },
                    onSave: () => Promise.reject(),
                    beforeLeave: () => Promise.resolve(false),
                    onSuccess: onSuccessSpy,
                    onError: onErrorSpy,
                    getMetadata: () => testMetadata,
                }));

            await handleSave(result.current.save);
            expect(onErrorSpy).toHaveBeenCalled();
        });

        it('Should reset isInProgress if onSave promise is rejected', async () => {
            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() =>
                useForm({
                    value: { ...testData, dummy: 'hi' },
                    onSave: () => Promise.reject(),
                    beforeLeave: () => Promise.resolve(false),
                    getMetadata: () => testMetadata,
                }));

            await handleSave(result.current.save);
            expect(result.current.isInProgress).toBeFalsy();
        });

        it('Should restore data from local storage after leaving form without saving changes', async () => {
            const loadUnsavedChangesMock = jest.fn().mockResolvedValue(true);
            const props: UseFormProps<IFoo> = {
                value: testData,
                settingsKey: 'form-test',
                onSave: () => Promise.resolve(),
                beforeLeave: null,
                getMetadata: () => testMetadata,
                loadUnsavedChanges: loadUnsavedChangesMock,
            };

            const { result: firstRenderResult, unmount, svc } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            act(() => firstRenderResult.current.lens.prop('dummy').set('hi'));

            unmount();

            const { result: secondRenderResult } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            expect(loadUnsavedChangesMock).toHaveBeenCalled();
            expect(secondRenderResult.current.lens.prop('dummy').get()).toBe('hi');
            // reset localStorage value
            svc.uuiUserSettings.set('form-test', null);
        });

        it('Should not invoke loadUnsavedChanges callback if localStorage value equal initial from value', async () => {
            const loadUnsavedChangesMock = jest.fn().mockResolvedValue(true);
            const props: UseFormProps<IFoo> = {
                value: testData,
                settingsKey: 'form-test',
                onSave: () => Promise.resolve(),
                beforeLeave: null,
                getMetadata: () => testMetadata,
                loadUnsavedChanges: loadUnsavedChangesMock,
            };

            const { result: firstRenderResult, unmount } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            act(() => firstRenderResult.current.lens.prop('dummy').set('hi'));
            // return to initial value
            act(() => firstRenderResult.current.lens.prop('dummy').set(''));

            expect(firstRenderResult.current.isChanged).toBe(false);

            unmount();

            await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            expect(loadUnsavedChangesMock).not.toHaveBeenCalled();
        });
    });

    describe('useForm before leave(lock)', () => {
        it('Should call beforeLeave callback when trying to leave form with unsaved changes', async () => {
            const saveMock = jest.fn().mockResolvedValue({ form: {} });
            const beforeLeaveMock = jest.fn().mockResolvedValue(true);

            const useFormHook = () =>
                useForm({
                    value: testData,
                    onSave: saveMock,
                    beforeLeave: beforeLeaveMock,
                    onError: jest.fn(),
                    getMetadata: () => testMetadata,
                });
            const { result, svc } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useFormHook, undefined);

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            await act(() => svc.uuiRouter.redirect('/'));

            expect(result.current.isInvalid).toBe(false);
            expect(beforeLeaveMock).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalled();
        });

        it('Should not call beforeLeave if form is not changed', async () => {
            const saveMock = jest.fn().mockResolvedValue(false);
            const beforeLeaveMock = jest.fn().mockResolvedValue(false);
            const props = {
                value: testData,
                onSave: saveMock,
                onError: jest.fn(),
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            expect(result.current.isChanged).toBe(false);
            expect(beforeLeaveMock).not.toHaveBeenCalled();

            act(() => result.current.lens.prop('dummy').set('hi'));
            act(() => result.current.lens.prop('dummy').set(''));

            expect(result.current.isChanged).toBe(false);
            expect(beforeLeaveMock).not.toHaveBeenCalled();
        });

        it('Should unblock router when form is saved', async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            const beforeLeaveMock = jest.fn().mockResolvedValue(false);
            const { wrapper, testUuiCtx: svc } = getDefaultUUiContextWrapper();
            const props = {
                value: testData,
                onSave: saveMock,
                onError: jest.fn(),
                beforeLeave: beforeLeaveMock,
                onSuccess: () => { svc.uuiRouter.redirect('/'); }, // We add redirect in onSuccess callback, to check that form 'unblock' router right after the save action
                getMetadata: () => testMetadata,
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props), props, { wrapper });

            expect(beforeLeaveMock).not.toHaveBeenCalled();

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            await act(async () => svc.uuiRouter.redirect('/'));
            expect(beforeLeaveMock).toHaveBeenCalledTimes(1);

            await act(async () => result.current.save());
            await act(async () => svc.uuiRouter.redirect('/'));

            expect(beforeLeaveMock).toHaveBeenCalledTimes(1);
            expect(saveMock).toHaveBeenCalled();
        });

        it('Should call beforeLeave when calling form.close method', async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            const beforeLeaveMock = jest.fn().mockResolvedValue(false);
            const props = {
                value: testData,
                onSave: saveMock,
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            await act(() => result.current.close()); // Form isn't changed
            expect(beforeLeaveMock).not.toHaveBeenCalled();

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            await act(() => result.current.close());

            expect(beforeLeaveMock).toHaveBeenCalledTimes(1);
        });

        it('Should make redirect and lock form aging if  beforeLeave return "remain"', async () => {
            const saveMock = jest.fn().mockResolvedValue(true);
            const beforeLeaveMock = jest.fn().mockResolvedValue('remain');
            const { wrapper, testUuiCtx: svc } = getDefaultUUiContextWrapper();
            const props = {
                value: testData,
                onSave: saveMock,
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props), props, { wrapper });

            expect(beforeLeaveMock).not.toHaveBeenCalled();

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            await act(() => svc.uuiRouter.redirect({ pathname: '/newLocation' }));
            expect(beforeLeaveMock).toHaveBeenCalledTimes(1);
            expect(svc.uuiRouter.getCurrentLink().pathname).toEqual('/newLocation');

            await act(() => svc.uuiRouter.redirect({ pathname: '/newLocation2' }));
            expect(beforeLeaveMock).toHaveBeenCalledTimes(2); // form still in lock
        });
    });

    describe('useForm Server validation', () => {
        interface IAdvancedFoo {
            dummy: string;
            deep: { inner: string };
            deep2?: { inner2: string };
        }

        const testDataLocal: IAdvancedFoo = { dummy: 'test', deep: { inner: '' } };
        const testMetadataLocal: Metadata<IAdvancedFoo> = { props: { dummy: { isRequired: true } } };

        it('Should correctly handle server validation', async () => {
            const serverResponse: FormSaveResponse<IAdvancedFoo> = {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        dummy: {
                            isInvalid: true,
                            validationMessage: 'Test error',
                        },
                        deep: {
                            isInvalid: true,
                            validationProps: {
                                inner: {
                                    isInvalid: true,
                                    validationMessage: 'Inner test error',
                                },
                            },
                        },
                    },
                },
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() =>
                useForm({
                    value: { dummy: '', deep: { inner: '' } },
                    onSave: () => Promise.resolve(serverResponse),
                    onSuccess: () => '',
                    getMetadata: () => testMetadataLocal,
                    beforeLeave: () => Promise.resolve(false),
                }));

            await act(async () => handleSave(result.current.save));
            expect(result.current.isInvalid).toBe(true);

            act(() => result.current.lens.prop('dummy').set('name'));

            await act(async () => handleSave(result.current.save));

            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('dummy').toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('dummy').toProps()).toHaveProperty(
                'validationMessage',
                serverResponse.validation.validationProps.dummy.validationMessage,
            );
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty(
                'validationMessage',
                serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage,
            );
            expect(result.current.isChanged).toEqual(true);
        });

        it('Should keep server error notification until field is changed', async () => {
            const serverResponse: FormSaveResponse<IAdvancedFoo> = {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        deep: {
                            isInvalid: true,
                            validationProps: {
                                inner: {
                                    isInvalid: true,
                                    validationMessage: 'Single test error',
                                },
                            },
                        },
                    },
                },
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() =>
                useForm({
                    value: { ...testDataLocal, deep: { inner: 'error' } },
                    onSave: ({ deep: { inner } }) => (inner === 'error' ? Promise.resolve(serverResponse) : Promise.resolve()),
                    onSuccess: () => '',
                    getMetadata: () => testMetadataLocal,
                    beforeLeave: () => Promise.resolve(false),
                }));

            await act(async () => handleSave(result.current.save));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty(
                'validationMessage',
                serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage,
            );

            act(() => result.current.lens.prop('dummy').set('changed'));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty('validationMessage', 'Single test error');

            act(() => result.current.lens.prop('deep').prop('inner').set('correct'));
            expect(result.current.lens.prop('deep').prop('inner').toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop('deep').prop('inner').toProps().validationProps).toBeUndefined();
        });

        it('Should keep only validationProps tree with validationMessage in the end', async () => {
            const serverResponse: FormSaveResponse<IAdvancedFoo> = {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        deep: {
                            isInvalid: true,
                            validationProps: {
                                inner: {
                                    isInvalid: true,
                                    validationMessage: 'First inner test error',
                                },
                            },
                        },
                        deep2: {
                            isInvalid: true,
                            validationProps: {
                                inner2: {
                                    isInvalid: true,
                                    validationMessage: 'Second inner test error',
                                },
                            },
                        },
                    },
                },
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() =>
                useForm({
                    value: { ...testDataLocal, deep: { inner: 'error1' }, deep2: { inner2: 'error' } },
                    onSave: () => Promise.resolve(serverResponse),
                    onSuccess: () => '',
                    getMetadata: () => testMetadataLocal,
                    beforeLeave: () => Promise.resolve(false),
                }));

            await act(async () => handleSave(result.current.save));

            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep').prop('inner').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep').prop('inner').toProps().validationMessage).toBe(
                serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage,
            );
            expect(result.current.lens.prop('deep2').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep2').prop('inner2').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep2').prop('inner2').toProps().validationMessage).toBe(
                serverResponse.validation.validationProps.deep2.validationProps.inner2.validationMessage,
            );

            act(() => result.current.lens.prop('deep').prop('inner').set('changed'));

            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop('deep').prop('inner').toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop('deep').prop('inner').toProps().validationMessage).toBe(undefined);
            expect(result.current.lens.prop('deep2').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep2').prop('inner2').toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop('deep2').prop('inner2').toProps().validationMessage).toBe(
                serverResponse.validation.validationProps.deep2.validationProps.inner2.validationMessage,
            );
        });

        it('Should change sever validation state via setServerValidationState callback', async () => {
            const serverResponse: FormSaveResponse<IAdvancedFoo> = {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        deep: {
                            isInvalid: true,
                            validationProps: {
                                inner: {
                                    isInvalid: true,
                                    validationMessage: 'Single test error',
                                },
                            },
                        },
                    },
                },
            };

            const { result } = await renderHookWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() =>
                useForm({
                    value: testDataLocal,
                    onSave: () => Promise.resolve(serverResponse),
                    onSuccess: () => '',
                    getMetadata: () => testMetadataLocal,
                    beforeLeave: () => Promise.resolve(false),
                }));

            await act(async () => result.current.save());

            expect(result.current.serverValidationState).toBe(serverResponse.validation);

            await act(async () => result.current.setServerValidationState(undefined));

            expect(result.current.serverValidationState).toBe(undefined);
        });
    });
});
