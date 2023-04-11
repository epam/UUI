import { useForm } from '../useForm';
import type { Metadata } from '../../../../index';
import type { FormSaveResponse, IFormApi, UseFormProps } from '../index';
import { testSvc, renderHookToJsdomWithContextAsync, act } from '@epam/test-utils';

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
    afterAll(() => {
        jest.resetAllMocks();
        Object.assign(testSvc, {});
    });

    describe('Basic updates handing', () => {
        it('Should update form value with onValueChange', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<string>, IFormApi<string>>(() => useForm({
                onSave: () => Promise.resolve(),
                onError: () => Promise.resolve(),
                value: 'a',
            }));

            act(() => result.current.onValueChange(('b')));
            expect(result.current.value).toBe('b');
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (plain value)', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<string>, IFormApi<string>>(() => useForm({
                onSave: () => Promise.resolve(),
                onError: () => Promise.resolve(),
                value: 'a',
            }));

            act(() => result.current.setValue(('b')));
            expect(result.current.value).toBe('b');
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (callback)', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<number>, IFormApi<number>>(() => useForm({
                onSave: () => Promise.resolve(),
                onError: () => Promise.resolve(),
                value: 1,
            }));

            act(() => result.current.setValue(x => x + 1));
            expect(result.current.value).toBe(2);
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should update form value with setValue (callback, 2 immediate updates)', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<number>, IFormApi<number>>(() => useForm({
                onSave: () => Promise.resolve(),
                onError: () => Promise.resolve(),
                value: 1,
            }));

            act(() => {
                result.current.setValue(x => x + 1);
                result.current.setValue(x => x + 1);
            });
            expect(result.current.value).toBe(3);
            expect(result.current.isChanged).toBe(true);
            expect(result.current.isInvalid).toBe(false);
        });

        it('should update form value by external props.value change', async () => {
            const { result, rerender } = await renderHookToJsdomWithContextAsync<UseFormProps<number>, IFormApi<number>>(
                (props) => useForm(props),
                {
                    onSave: () => Promise.resolve(),
                    value: 1,
                },
            );

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
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
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
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
                value: testData,
                onSave: onSaveSpy,
                onError: jest.fn(),
                getMetadata: () => testMetadata,
            }));

            await handleSave(result.current.save);
            expect(result.current.isInvalid).toBe(true);

            act(() => result.current.lens.prop("dummy").set("hello"));
            expect(result.current.isChanged).toBe(true);

            await act(() => handleSave(result.current.save));
            expect(result.current.value).toStrictEqual({ dummy: "hello", tummy: '' });
            expect(onSaveSpy).toHaveBeenCalled();
            expect(result.current.isInvalid).toBe(false);
        });

        it('Should start validation on save and keep validation state valid values passed', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
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

        it('Should do nothing, if value isn`t changed', async () => {
            const saveMock = jest.fn().mockResolvedValue(false);
            const beforeLeaveMock = jest.fn().mockResolvedValue(false);
            const props = {
                value: testData,
                onSave: saveMock,
                onError: jest.fn(),
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            };

            const { result, rerender } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            rerender(props);

            expect(beforeLeaveMock).not.toHaveBeenCalled();
            expect(saveMock).not.toHaveBeenCalled();

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            rerender(props);
            expect(result.current.isChanged).toBe(true);

            expect(beforeLeaveMock).not.toHaveBeenCalled();
            expect(saveMock).not.toHaveBeenCalled();
        });

        it('Should return isInvalid as false for 1 or more invalid fields', async () => {
            const enhancedMetadata = { ...testMetadata, props: { ...testMetadata.props, tummy: testMetadata.props.dummy } };
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
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
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
                value: { dummy: 'hello' },
                onSave: (form) => Promise.resolve({form: form}),
                onError: jest.fn(),
                getMetadata: () => ({ props: { dummy: { isRequired: true }, tummy: { isRequired: true } } }),
                validationOn: 'change',
            }));

            act(() => result.current.lens.prop('dummy').set(null));
            expect(result.current.lens.toProps().validationProps).toStrictEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: "The field is mandatory",
                },
                tummy: {
                    isInvalid: false,
                },
            });

            await handleSave(result.current.save);

            expect(result.current.lens.toProps().validationProps).toStrictEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: "The field is mandatory",
                },
                tummy: {
                    isInvalid: true,
                    validationMessage: "The field is mandatory",
                },
            });
        });

        it('Should allow to replace getMetadata prop', async () => {
            const props = {
                value: { dummy: "test" },
                onSave: (form) => Promise.resolve({form: form}),
                onError: jest.fn(),
                getMetadata: () => ({}),
                validationOn: 'change',
            }

            const { result, rerender } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(useForm<IFoo>, props);

            act(() => result.current.lens.prop('dummy').set(""));

            // The form is valid, as there's nothing in metadata
            expect(result.current.isInvalid).toEqual(false);

            // Update the getMetadata callback so 'dummy' is now required
            act(() => {
                rerender({
                    ...props,
                    getMetadata: () => ({ props: { dummy: { isRequired: true }}}),
                });
            });

            act(() => result.current.lens.prop('dummy').set(" "));

            // We haven't change the form value, however with the new getMetadata is should be invalid
            expect(result.current.isInvalid).toEqual(true);

            expect(result.current.validationProps).toEqual({
                dummy: {
                    isInvalid: true,
                    validationMessage: "The field is mandatory",
                },
            });
        });
    });

    describe('isChanged, redo/undo/revert handing', () => {
        it('Should set isChange=false after form saved', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
                value: testData,
                onSave: (form) => Promise.resolve({form: form}),
                onError: jest.fn(),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.isChanged).toBe(true);

            await act(() => handleSave(result.current.save));

            expect(result.current.isChanged).toBe(false);
        });

        it('Should show the same value, if you: save => leave => come back', async () => {
            const saveMock = jest.fn().mockResolvedValue({ form: {} });
            const beforeLeaveMock = jest.fn().mockResolvedValue(true);

            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
                value: testData,
                onSave: saveMock,
                beforeLeave: beforeLeaveMock,
                onError: jest.fn(),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            await act(() => testSvc.uuiLocks.acquire(() => Promise.resolve()));

            expect(result.current.isInvalid).toBe(false);
            expect(beforeLeaveMock).toHaveBeenCalled();
            expect(saveMock).toHaveBeenCalled();
        });

        it('Should undo to previous value, redo to the next value', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
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
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
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
                onSave: async (value) => {},
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            };

            const { result, rerender } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(
                () => useForm<IFoo>(props)
            );

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
            }

            const { result, rerender } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(
                () => useForm<IFoo>(props)
            );

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
            expect(result.current.isChanged).toBe(true)
            expect(result.current.canUndo).toBe(true);
            expect(result.current.canRedo).toBe(false);
            expect(result.current.value.dummy).toBe('hi again');
        });

        it('Should allow to replaceValue', async () => {
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<string>, IFormApi<string>>(() => useForm<string>({
                value: 'a',
                onSave: (form) => Promise.resolve({form: form}),
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
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
                value: testData,
                onSave: person => Promise.resolve({ form: person }),
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
            expect(testSvc.uuiLocks.getCurrentLock()).not.toBe(null);

            await act(() => handleSave(result.current.save));
            expect(testSvc.uuiLocks.getCurrentLock()).toBe(null);
        });

        it('Should reset lock after component unmount', async () => {
            const beforeLeaveMock = jest.fn().mockResolvedValue(false);
            const { result, unmount } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
                value: testData,
                onSave: () => Promise.resolve(),
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop("dummy").set("hi"));
            expect(result.current.isChanged).toBe(true);

            unmount();
            const currentLock = testSvc.uuiLocks.getCurrentLock();
            expect(currentLock).toBeNull();
        });

        it('Should store unsaved data to localstorage', async () => {
            const settingsKey = 'form-test';
            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm<IFoo>({
                value: testData,
                settingsKey,
                onSave: Promise.resolve,
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testSvc.uuiUserSettings.get<IFoo>(settingsKey).dummy).toBe('hi');
            act(() => testSvc.uuiUserSettings.set<IFoo>(settingsKey, null));
        });

        it('Should clear unsaved data in localstorage after save', async () => {
            const settingsKey = 'form-test';
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
                value: testData,
                settingsKey,
                onSave: data => Promise.resolve({ form: data }),
                beforeLeave: () => Promise.resolve(false),
                onSuccess: onSuccessSpy,
                onError: onErrorSpy,
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testSvc.uuiUserSettings.get<IFoo>(settingsKey).dummy).toBe('hi');

            await act(() => handleSave(result.current.save));
            expect(testSvc.uuiUserSettings.get<IFoo>(settingsKey)).toBe(null);
            expect(onSuccessSpy).toHaveBeenCalled();
        });

        it('Should call onError if onSave promise is rejected', async () => {
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
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

        it('Should restore data from local storage after leaving form without saving changes', async () => {
            const props: UseFormProps<IFoo> = {
                value: testData,
                settingsKey: 'form-test',
                onSave: () => Promise.resolve(),
                beforeLeave: null,
                getMetadata: () => testMetadata,
            };

            const { result: firstRenderResult, unmount } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm(props));

            act(() => firstRenderResult.current.lens.prop('dummy').set('hi'));

            unmount();

            const { result: secondRenderResult } = await renderHookToJsdomWithContextAsync<UseFormProps<IFoo>, IFormApi<IFoo>>(() => useForm({
                ...props,
                loadUnsavedChanges: jest.fn().mockResolvedValueOnce(true),
            }));

            expect(secondRenderResult.current.lens.prop("dummy").get()).toBe("hi");
        });
    });

    describe('useForm Server validation', () => {
        interface IAdvancedFoo {
            dummy: string;
            deep: { inner: string };
            deep2?: { inner2: string };
        }

        const testData: IAdvancedFoo = { dummy: "test", deep: { inner: "" } };
        const testMetadata: Metadata<IAdvancedFoo> = { props: { dummy: { isRequired: true } } };

        it('Should correctly handle server validation', async () => {
            const serverResponse: FormSaveResponse<IAdvancedFoo> = {
                validation: {
                    isInvalid: true,
                    validationProps: {
                        dummy: {
                            isInvalid: true,
                            validationMessage: "Test error",
                        },
                        deep: {
                            isInvalid: true,
                            validationProps: {
                                inner: {
                                    isInvalid: true,
                                    validationMessage: "Inner test error",
                                },
                            },
                        },
                    },
                },
            };

            const { result: firstResult, unmount } = await renderHookToJsdomWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() => useForm({
                value: testData,
                onSave: data => Promise.resolve({ form: data }),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await act(() => handleSave(firstResult.current.save));
            expect(firstResult.current.isInvalid).toBe(false);

            unmount();

            const { result: secondResult } = await renderHookToJsdomWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() => useForm({
                value: testData,
                onSave: () => Promise.resolve(serverResponse),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
            }));

            await act(() => handleSave(secondResult.current.save));
            expect(secondResult.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(secondResult.current.lens.prop('dummy').toProps()).toHaveProperty('isInvalid', true);
            expect(secondResult.current.lens.prop('dummy').toProps()).toHaveProperty('validationMessage', serverResponse.validation.validationProps.dummy.validationMessage);
            expect(secondResult.current.lens.prop("deep").prop("inner").toProps()).toHaveProperty('isInvalid', true);
            expect(secondResult.current.lens.prop("deep").prop("inner").toProps()).toHaveProperty("validationMessage", serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage);
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
                                    validationMessage: "Single test error",
                                },
                            },
                        },
                    },
                },
            };

            const { result } = await renderHookToJsdomWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() => useForm({
                value: { ...testData, deep: { inner: 'error' } },
                onSave: ({ deep: { inner } }) => inner === "error"
                    ? Promise.resolve(serverResponse)
                    : Promise.resolve(),
                onSuccess: () => "",
                getMetadata:() => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await act(() => handleSave(result.current.save));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("isInvalid", true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("validationMessage", serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage);

            act(() => result.current.lens.prop("dummy").set("changed"));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("isInvalid", true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("validationMessage", "Single test error");

            act(() => result.current.lens.prop("deep").prop("inner").set("correct"));
            expect(result.current.lens.prop('deep').prop("inner").toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop('deep').prop("inner").toProps().validationProps).toBeUndefined();
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
                                    validationMessage: "First inner test error",
                                },
                            },
                        },
                        deep2: {
                            isInvalid: true,
                            validationProps: {
                                inner2: {
                                    isInvalid: true,
                                    validationMessage: "Second inner test error",
                                },
                            },
                        },
                    },
                },
            };

            const { result }  = await renderHookToJsdomWithContextAsync<UseFormProps<IAdvancedFoo>, IFormApi<IAdvancedFoo>>(() => useForm({
                value: { ...testData, deep: { inner: 'error1' }, deep2: { inner2: 'error' } },
                onSave: () => Promise.resolve(serverResponse),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await act(() => handleSave(result.current.save));

            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop("deep").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep").prop("inner").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep").prop("inner").toProps().validationMessage).toBe(serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage);
            expect(result.current.lens.prop("deep2").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep2").prop("inner2").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep2").prop("inner2").toProps().validationMessage).toBe(serverResponse.validation.validationProps.deep2.validationProps.inner2.validationMessage);

            act(() => result.current.lens.prop("deep").prop("inner").set("changed"));

            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop("deep").toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop("deep").prop("inner").toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop("deep").prop("inner").toProps().validationMessage).toBe(undefined);
            expect(result.current.lens.prop("deep2").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep2").prop("inner2").toProps().isInvalid).toBe(true);
            expect(result.current.lens.prop("deep2").prop("inner2").toProps().validationMessage).toBe(serverResponse.validation.validationProps.deep2.validationProps.inner2.validationMessage);
        });
    });
});
