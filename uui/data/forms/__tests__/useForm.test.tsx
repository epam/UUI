import React from 'react';
import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../useForm';
import { Metadata, ContextProvider } from '../../..';
import { FormSaveResponse, RenderFormProps, UseFormProps } from '..';
import { testSvc } from '@epam/test-utils';

export async function mountHookWithContext<TProps, TResult>(hook) {
    const wrapper = ({ children }: { children?: React.ReactNode }) => (
        <ContextProvider onInitCompleted={ svc => Object.assign(testSvc, svc) }>
            { children }
        </ContextProvider>
    );

    const {
        waitForNextUpdate,
        rerender,
        ...rest
    } = renderHook<TProps, TResult>(hook, { wrapper });

    await waitForNextUpdate();

    return {
        rerender: (props: TProps) => rerender({ ...props, children: undefined }),
        waitForNextUpdate,
        ...rest,
    };
};

async function handleSave(save: () => void) {
    try {
        return await act(save);
    } catch (err: unknown) {
        if (err !== undefined) throw err;
        return err;
    };
};

describe('useForm', () => {
    beforeEach(jest.clearAllMocks);
    afterEach(cleanup);

    describe('Client validation', () => {
        interface IFoo {
            dummy: string;
            tummy?: string;
        };

        const testMetadata = { props: { dummy: { isRequired: true } } };
        const testData: IFoo = { dummy: '', tummy: '' };

        it('Should return isChanged as true whenever the lens is changed', async () => {
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                onSave: () => Promise.resolve(),
                onError: () => Promise.resolve(),
                value: testData,
                getMetadata: () => testMetadata
            }));

            act(() => result.current.lens.prop('dummy').set('hello'));

            expect(result.current.isChanged).toBe(true);
            expect(result.current.value).toStrictEqual({ dummy: 'hello', tummy: '' });
        });

        it('Should correctly set isInvalid on form submit depending on the value', async () => {
            const onSaveSpy = jest.fn().mockResolvedValue(undefined);
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm<IFoo>({
                value: testData,
                onSave: onSaveSpy,
                onError: jest.fn(),
                getMetadata: () => testMetadata,
            }));

            await handleSave(result.current.save);
            expect(result.current.isInvalid).toBe(true)

            act(() => result.current.lens.prop("dummy").set("hello"));
            expect(result.current.isInvalid).toBe(false);

            await handleSave(result.current.save).then(() => expect(onSaveSpy).toHaveBeenCalled());
        });

        it('Should start validation on save and keep validation state valid values passed', async () => {
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
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
            const props = {
                value: testData,
                onSave: saveMock,
                onError: jest.fn(),
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            };

            const { result, rerender } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm(props));

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
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
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

        it('Should show the same value, if you: save => leave => come back', async () => {
            const saveMock = jest.fn().mockResolvedValue({ form: {} });
            const beforeLeaveMock = jest.fn().mockResolvedValue(true);

            const { result, waitFor } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: saveMock,
                beforeLeave: beforeLeaveMock,
                onError: jest.fn(),
                getMetadata: () => testMetadata,
            }));

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
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: Promise.resolve,
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);

            act(() => result.current.undo());
            expect(result.current.value.dummy).toBe(testData['dummy']);

            act(() => result.current.redo());
            expect(result.current.value.dummy).toBe('hi');
            expect(result.current.isChanged).toBe(true);
        });

        it('Should revert and load last passed value', async () => {
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: Promise.resolve,
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
            expect(result.current.value.dummy).toBe('hi');

            act(() => result.current.lens.prop('dummy').set('hello'));
            expect(result.current.value.dummy).toBe('hello');

            act(() => result.current.revert());
            expect(result.current.value.dummy).toBe(testData['dummy']);
        });

        it('Should have a lock on the first form change, release lock on save', async () => {
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: person => Promise.resolve({ form: person }),
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(result.current.isChanged).toBe(true);
            expect(testSvc.uuiLocks.getCurrentLock()).not.toBe(null);

            await handleSave(result.current.save);
            expect(testSvc.uuiLocks.getCurrentLock()).toBe(null);
        });

        it('Should call beforeLeave after component unmount', async () => {
            const beforeLeaveMock = jest.fn().mockResolvedValueOnce(true);
            const { result, unmount, waitFor } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: data => Promise.resolve({ form: data }),
                beforeLeave: beforeLeaveMock,
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop("dummy").set("hi"));
            expect(result.current.isChanged).toBe(true);

            unmount();
            waitFor(() => {
                expect(beforeLeaveMock).toHaveBeenCalled();
            });
        });

        it('Should store unsaved data to localstorage', async () => {
            const settingsKey = 'form-test';
            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                settingsKey,
                onSave: Promise.resolve,
                beforeLeave: () => Promise.resolve(false),
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testSvc.uuiUserSettings.get(settingsKey).dummy).toBe('hi');
            act(() => testSvc.uuiUserSettings.set(settingsKey, null));
        });

        it('Should clear unsaved data in localstorage after save', async () => {
            const settingsKey = 'form-test';
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { result } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                settingsKey,
                onSave: data => Promise.resolve({ form: data }),
                beforeLeave: () => Promise.resolve(false),
                onSuccess: onSuccessSpy,
                onError: onErrorSpy,
                getMetadata: () => testMetadata,
            }));

            act(() => result.current.lens.prop('dummy').set('hi'));
            expect(testSvc.uuiUserSettings.get(settingsKey).dummy).toBe('hi');

            await handleSave(result.current.save);
            expect(testSvc.uuiUserSettings.get(settingsKey)).toBe(null);
            expect(onSuccessSpy).toHaveBeenCalled();
        });

        it('Should call onError if onSave promise is rejected', async () => {
            const onSuccessSpy = jest.fn();
            const onErrorSpy = jest.fn();

            const { result, waitFor } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                value: testData,
                onSave: () => Promise.reject('Failed'),
                beforeLeave: () => Promise.resolve(false),
                onSuccess: onSuccessSpy,
                onError: onErrorSpy,
                getMetadata: () => testMetadata,
            }));

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

            const { result: firstRenderResult, unmount } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm(props));

            act(() => firstRenderResult.current.lens.prop('dummy').set('hi'));

            unmount();

            const { result: secondRenderResult, waitForNextUpdate } = await mountHookWithContext<UseFormProps<IFoo>, RenderFormProps<IFoo>>(() => useForm({
                ...props,
                loadUnsavedChanges: loadUnsavedChangesMock,
            }));

            await waitForNextUpdate();

            expect(loadUnsavedChangesMock).toHaveBeenCalled();
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

            const { result: firstResult, unmount } = await mountHookWithContext<UseFormProps<IAdvancedFoo>, RenderFormProps<IAdvancedFoo>>(() => useForm({
                value: testData,
                onSave: data => Promise.resolve({ form: data }),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await handleSave(firstResult.current.save);
            expect(firstResult.current.isInvalid).toBe(false);

            unmount();

            const { result: secondResult } = await mountHookWithContext<UseFormProps<IAdvancedFoo>, RenderFormProps<IAdvancedFoo>>(() => useForm({
                value: testData,
                onSave: () => Promise.resolve(serverResponse),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
            }));

            await handleSave(secondResult.current.save);
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

            const { result } = await mountHookWithContext<UseFormProps<IAdvancedFoo>, RenderFormProps<IAdvancedFoo>>(() => useForm({
                value: { ...testData, deep: { inner: 'error' } },
                onSave: ({ deep: { inner } }) => inner === "error"
                    ? Promise.resolve(serverResponse)
                    : Promise.resolve(),
                onSuccess: () => "",
                getMetadata:() => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await handleSave(result.current.save);
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("isInvalid", true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("validationMessage", serverResponse.validation.validationProps.deep.validationProps.inner.validationMessage);

            act(() => result.current.lens.prop("dummy").set("changed"));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("isInvalid", true);
            expect(result.current.lens.prop('deep').prop('inner').toProps()).toHaveProperty("validationMessage", "Single test error");

            act(() => result.current.lens.prop("deep").prop("inner").set("correct"));
            expect(result.current.lens.toProps()).toHaveProperty('isInvalid', false);
            expect(result.current.lens.prop('deep').toProps().isInvalid).toBe(false);
            expect(result.current.lens.prop('deep').toProps().validationProps).toBeUndefined();
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

            const { result }  = await mountHookWithContext<UseFormProps<IAdvancedFoo>, RenderFormProps<IAdvancedFoo>>(() => useForm({
                value: { ...testData, deep: { inner: 'error1' }, deep2: { inner2: 'error' } },
                onSave: () => Promise.resolve(serverResponse),
                onSuccess: () => "",
                getMetadata: () => testMetadata,
                beforeLeave: () => Promise.resolve(false),
            }));

            await handleSave(result.current.save);

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