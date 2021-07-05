import React from 'react';
import { ReactWrapper } from 'enzyme';
import { delay, mountWithContextAsync, testSvc } from "@epam/test-utils";
import { LockContext, Metadata, ILens } from '../../..';
import { UserSettingsContext } from '../../../services/UserSettingsContext';
import { Form, RenderFormProps, FormProps, FormSaveResponse } from '../Form';

interface IFoo {
    dummy: string;
    tummy?: string;
}

describe("Form", () => {
    let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
    let testContext: {
        uuiLocks: LockContext,
        uuiUserSettings: UserSettingsContext,
    };
    let fooMetadata: Metadata<IFoo>;

    let onSuccessSpy = jest.fn();
    let onErrorSpy = jest.fn();

    const getForm = (wrapper: ReactWrapper): Form<any> => wrapper.find(Form).instance() as Form<any>;

    beforeEach(() => {
        testContext = {
            uuiLocks: new LockContext({ block: jest.fn().mockImplementation(() => jest.fn()) } as any),
            uuiUserSettings: new UserSettingsContext(),
        };
        fooMetadata = {
            props: {
                dummy: { isRequired: true },
            },
        };

        onSuccessSpy = jest.fn();
        onErrorSpy = jest.fn();

    });

    afterEach(() => {
        wrapper && wrapper.unmount();
    });

    it('should call renderFunc with an object which has property isChanged == false', async () => {
        const renderForm = (): React.ReactNode => null;
        const renderFormSpy = jest.fn(renderForm);

        wrapper = await mountWithContextAsync(
            <Form<number>
                renderForm={ renderFormSpy }
                value={ 1 }
                onSave={ () => Promise.resolve() }
            />,
        );

        expect(renderFormSpy).toHaveBeenCalledTimes(1);
        // @ts-ignore
        expect(renderFormSpy.mock.calls[0][0].isChanged).toBe(false);
    });

    it('should set this.state.isChanged to true whenever lens is changed', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form
                renderForm={ renderForm }
                value={ { dummy: "" } }
                onSave={ () => Promise.resolve() }
                getMetadata={ () => fooMetadata }
                beforeLeave={ () => Promise.resolve(true) }
            />,
        );

        formProps.lens.prop("dummy").set("hello");
        expect(getForm(wrapper).state.isChanged).toBe(true);
        expect(getForm(wrapper).state.form).toEqual({ dummy: "hello" });
    });

    it('should set invalid value to empty isRequired field and valid to filled field', async () => {
        let lens: ILens<IFoo>;
        let handleSave: () => void;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            lens = props.lens;
            handleSave = props.save;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "" } }
                onSave={ () => Promise.resolve() }
                getMetadata={ () => fooMetadata }
                beforeLeave={ () => Promise.resolve(true) }
            />,
        );

        handleSave();

        expect(getForm(wrapper).state.validationState).toHaveProperty('isInvalid', true);
        lens.prop("dummy").set("hello");
        expect(getForm(wrapper).state.isChanged).toBe(true);

        handleSave();

        expect(getForm(wrapper).state.form).toEqual({ dummy: "hello" });
        expect(getForm(wrapper).state.validationState).toHaveProperty('isInvalid', false);
    });

    it('should start checking validation until get back to the valid state', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Checking the validation state handling
        // Initially the form is considered valid, even that 'dummy' is not set
        expect(formProps.lens.prop('dummy').toProps().isInvalid).toBe(false);

        // After we set 'dummy' field to something, the form is valid too
        formProps.lens.prop("dummy").set("hello");
        expect(formProps.value.dummy).toBe('hello');
        expect(formProps.lens.prop('dummy').toProps().isInvalid).toBe(false);

        // After we set the field to '' (invalid), we still show form as valid, as user might change his mind
        formProps.lens.prop('dummy').set('');
        expect(formProps.lens.prop('dummy').toProps().isInvalid).toBe(false);

        // Only after save, we trigger validation for the first time, and after this the form becomes invalid
        formProps.save();
        expect(formProps.lens.prop('dummy').toProps().isInvalid).toBe(true);

        // After user fixed the problem, the field immediately becomes valid again
        formProps.lens.prop("dummy").set("hi");
        expect(formProps.lens.prop("dummy").toProps().isInvalid).toBe(false);

        wrapper.unmount();
        wrapper = null;
        await delay();
    });


    it('should do nothing, if props.value is not changed', async () => {
        let formProps: RenderFormProps<IFoo> = null;
        let beforeLeaveMock = jest.fn(() => Promise.resolve(false));
        let saveMock = jest.fn(() => Promise.resolve(false));

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const props: FormProps<IFoo> = {
            renderForm,
            value: { dummy: "test" },
            beforeLeave: beforeLeaveMock,
            onSave: () => Promise.resolve(),
            getMetadata: () => fooMetadata,
        };

        wrapper = await mountWithContextAsync(<Form<IFoo> { ...props } />);

        // Just re-render component with the same props. Nothing should happen.
        wrapper.setProps({ props });
        expect(beforeLeaveMock).not.toBeCalled();
        expect(saveMock).not.toBeCalled();

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);

        // Then, we re-render, with the exactly same props. Nothing should happen.
        wrapper.setProps({ props });
        expect(getForm(wrapper).state.isChanged).toBe(true);

        expect(beforeLeaveMock).not.toBeCalled();
        expect(saveMock).not.toBeCalled();
    });

    it('should form be invalid with 2 invalid fields, 1 invalid field, valid with correct fields', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const fooMetadata: Metadata<IFoo> = {
            props: {
                dummy: { isRequired: true },
                tummy: { isRequired: true },
            },
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "", tummy: "" } }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        expect(formProps.isInvalid).toBe(false);
        formProps.save();
        expect(formProps.isInvalid).toBe(true);

        formProps.lens.prop("dummy").set("hello");
        expect(formProps.value.dummy).toBe('hello');
        expect(formProps.isInvalid).toBe(true);

        formProps.lens.prop("tummy").set("hello");
        expect(formProps.value.tummy).toBe('hello');
        expect(formProps.isInvalid).toBe(false);
    });

    it('should show the same value, if you: save => leave => come back', async () => {
        let formProps: RenderFormProps<IFoo> = null;
        let beforeLeaveMock = jest.fn(() => Promise.resolve(true));
        let saveMock = jest.fn(() => Promise.resolve());

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const props: FormProps<IFoo> = {
            renderForm,
            value: { dummy: "test" },
            beforeLeave: beforeLeaveMock,
            onSave: saveMock,
            getMetadata: () => fooMetadata,
        };

        wrapper = await mountWithContextAsync(<Form<IFoo> { ...props } />);

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);
        await testSvc.uuiLocks.acquire(() => Promise.resolve());

        expect(formProps.isInvalid).toBe(false);
        expect(beforeLeaveMock).toHaveBeenCalled();
        expect(saveMock).toHaveBeenCalled();
    });

    it('should undo get previous value, redo - next value', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);
        formProps.undo();
        expect(formProps.value.dummy).toBe('test');
        formProps.redo();
        expect(formProps.value.dummy).toBe('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);
    });

    it('should revert load last passed value', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);
        formProps.lens.prop('dummy').set('hello');
        formProps.revert();
        expect(formProps.value.dummy).toBe('test');
    });

    it('should get lock with first form changing, release lock when save', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        expect(getForm(wrapper).state.isChanged).toBe(true);
        expect(testSvc.uuiLocks.getCurrentLock()).not.toBe(null);
        await formProps.save();
        expect(testSvc.uuiLocks.getCurrentLock()).toBe(null);
    });

    it('should call beforeLeave func after component unmount', async () => {
        let formProps: RenderFormProps<IFoo> = null;
        let beforeLeaveMock = jest.fn(() => Promise.resolve(false));

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const props: FormProps<IFoo> = {
            renderForm,
            value: { dummy: "test" },
            beforeLeave: beforeLeaveMock,
            onSave: () => Promise.resolve(),
            getMetadata: () => fooMetadata,
        };

        wrapper = await mountWithContextAsync(<Form<IFoo>{ ...props }/>);

        formProps.lens.prop("dummy").set("hi");
        expect(getForm(wrapper).state.isChanged).toBe(true);

        await delay();

        wrapper.unmount();
        wrapper = null;
        expect(beforeLeaveMock).toHaveBeenCalled();
    });

    it("should store unsaved data to local storage", async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const settingKey = 'form-test';

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                settingsKey={ settingKey }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        const unsavedData: { dummy: string } = testContext.uuiUserSettings.get(settingKey);
        expect(unsavedData.dummy).toBe('hi');
        testContext.uuiUserSettings.set(settingKey, null);
    });

    it('should clear unsaved data in local storage after save', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const settingKey = 'form-test';

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                settingsKey={ settingKey }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                onSuccess={ onSuccessSpy }
                onError={ onErrorSpy }
                getMetadata={ () => fooMetadata }
            />,
        );

        // Ok. Now we'll change to form
        formProps.lens.prop('dummy').set('hi');
        const unsavedData: { dummy: string } = testContext.uuiUserSettings.get(settingKey);
        expect(unsavedData.dummy).toBe('hi');

        await formProps.save();

        expect(testContext.uuiUserSettings.get(settingKey)).toBe(null);
        expect(onSuccessSpy).toBeCalledTimes(1);
    });

    it('should call onError handler on rejected onSave promise', async () => {
        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ () => null }
                value={ { dummy: "test" } }
                onSave={ () => Promise.reject() }
                beforeLeave={ () => Promise.resolve(false) }
                onSuccess={ onSuccessSpy }
                onError={ onErrorSpy }
                getMetadata={ () => fooMetadata }
            />,
        );

        const instance = wrapper.find(Form).instance() as Form<IFoo>;

        await instance.handleSave();
        expect(onErrorSpy).toBeCalledTimes(1);

    });

    it('should restore from local storage data after leave form without save changes', async () => {
        let formProps: RenderFormProps<IFoo> = null;

        const renderForm = (props: RenderFormProps<IFoo>): React.ReactNode => {
            formProps = props;
            return null;
        };

        const settingKey = 'form-test';

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                settingsKey={ settingKey }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                getMetadata={ () => fooMetadata }
            />,
        );

        formProps.lens.prop('dummy').set('hi');

        wrapper.unmount();

        wrapper = await mountWithContextAsync(
            <Form<IFoo>
                renderForm={ renderForm }
                value={ { dummy: "test" } }
                settingsKey={ settingKey }
                onSave={ () => Promise.resolve() }
                beforeLeave={ () => Promise.resolve(false) }
                loadUnsavedChanges={ () => Promise.resolve() }
                getMetadata={ () => fooMetadata }
            />,
        );

        expect(formProps.lens.prop("dummy").get()).toBe("hi");
    });

    describe("Form: server validation", () => {
        interface IAdvancedFoo {
            dummy: string;
            deep: {
                inner: string,
            };
            deep2?: {
                inner2: string;
            };
        }

        let lens: ILens<IAdvancedFoo>;
        let handleSave: () => void;

        const renderForm = (props: RenderFormProps<IAdvancedFoo>): React.ReactNode => {
            lens = props.lens;
            handleSave = props.save;
            return null;
        };

        it("should correctly handle server validation", async () => {
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

            wrapper = await mountWithContextAsync(
                <Form<IAdvancedFoo>
                    renderForm={ renderForm }
                    value={ { dummy: "test", deep: { inner: "" } } }
                    onSave={ () => Promise.resolve() }
                    onSuccess={ () => "" }
                    getMetadata={ () => fooMetadata }
                    beforeLeave={ () => Promise.resolve(false) }
                />,
            );

            await handleSave();

            expect(getForm(wrapper).state.validationState).toHaveProperty("isInvalid", false);

            wrapper.unmount();

            wrapper = await mountWithContextAsync(
                <Form<IAdvancedFoo>
                    renderForm={ renderForm }
                    value={ { dummy: "test", deep: { inner: "" } } }
                    onSave={ () => Promise.resolve(serverResponse) }
                    onSuccess={ () => "" }
                    getMetadata={ () => fooMetadata }
                />,
            );

            await handleSave();

            const props = lens.toProps();

            expect(props).toHaveProperty("isInvalid", true);

            const dummy = lens.prop("dummy").toProps();
            expect(dummy).toHaveProperty("isInvalid", true);
            expect(dummy).toHaveProperty("validationMessage", "Test error");

            const inner = lens.prop("deep").prop("inner").toProps();

            expect(inner).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("validationMessage", "Inner test error");
        });

        it("should keep server error notification while field is not changed", async () => {
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

            const onSave = (state: IAdvancedFoo) => {
                return state.deep.inner === "error"
                    ? Promise.resolve(serverResponse)
                    : Promise.resolve();
            };

            wrapper = await mountWithContextAsync(
                <Form<IAdvancedFoo>
                    renderForm={ renderForm }
                    value={ { dummy: "test", deep: { inner: "error" } } }
                    onSave={ onSave }
                    onSuccess={ () => "" }
                    getMetadata={ () => fooMetadata }
                    beforeLeave={ () => Promise.resolve(false) }
                />,
            );

            await handleSave();

            let props = lens.toProps();
            let inner = lens.prop("deep").prop("inner").toProps();

            expect(props).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("validationMessage", "Single test error");

            lens.prop("dummy").set("changed");

            props = lens.toProps();
            inner = lens.prop("deep").prop("inner").toProps();

            expect(props).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("validationMessage", "Single test error");

            lens.prop("deep").prop("inner").set("correct");

            props = lens.toProps();
            let deep = lens.prop("deep").toProps();

            expect(props).toHaveProperty("isInvalid", false);
            expect(deep.isInvalid).toBe(undefined);
            expect(deep.validationProps).toBe(undefined);
        });

        it("should keep only validationProps tree with validationMessage in the end", async () => {
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

            const onSave = () => {
                return Promise.resolve(serverResponse);
            };

            wrapper = await mountWithContextAsync(
                <Form<IAdvancedFoo>
                    renderForm={ renderForm }
                    value={ { dummy: "test", deep: { inner: "error1" }, deep2: { inner2: "error2" } } }
                    onSave={ onSave }
                    onSuccess={ () => "" }
                    getMetadata={ () => fooMetadata }
                    beforeLeave={ () => Promise.resolve(false) }
                />,
            );

            await handleSave();

            let props = lens.toProps();
            let deep = lens.prop("deep").toProps();
            let deep2 = lens.prop("deep2").toProps();
            let inner = lens.prop("deep").prop("inner").toProps();
            let inner2 = lens.prop("deep2").prop("inner2").toProps();

            expect(props).toHaveProperty("isInvalid", true);

            expect(deep).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("isInvalid", true);
            expect(inner).toHaveProperty("validationMessage", "First inner test error");

            expect(deep2).toHaveProperty("isInvalid", true);
            expect(inner2).toHaveProperty("isInvalid", true);
            expect(inner2).toHaveProperty("validationMessage", "Second inner test error");

            lens.prop("deep").prop("inner").set("changed");

            props = lens.toProps();
            deep = lens.prop("deep").toProps();
            deep2 = lens.prop("deep2").toProps();
            inner = lens.prop("deep").prop("inner").toProps();
            inner2 = lens.prop("deep2").prop("inner2").toProps();

            expect(props).toHaveProperty("isInvalid", true);

            expect(deep).toHaveProperty("isInvalid", false);
            expect(inner).toHaveProperty("isInvalid", false);
            expect(inner.validationMessage).toBe(undefined);

            expect(deep2).toHaveProperty("isInvalid", true);
            expect(inner2).toHaveProperty("isInvalid", true);
            expect(inner2).toHaveProperty("validationMessage", "Second inner test error");
        });
    });
});