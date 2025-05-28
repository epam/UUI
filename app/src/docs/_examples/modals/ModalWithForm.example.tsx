import React, { useCallback } from 'react';
import { IModal, useUuiContext, useAsyncDataSource, LazyDataSourceApiResponse } from '@epam/uui-core';
import { Country } from '@epam/uui-docs';
import { ModalBlocker, ModalWindow, FlexSpacer, ModalHeader, FlexRow, LabeledInput, TextInput, Button, ScrollBars, ModalFooter, SuccessNotification, useForm, Text,
    Panel, FlexCell, RadioGroup, PickerInput } from '@epam/uui';
import css from './styles.module.scss';

interface Person {
    firstName?: string;
    lastName?: string;
    countryId?: number | string;
    sex?: string;
}

function ModalWithFormExample(modalProps: IModal<Person>) {
    const svc = useUuiContext();

    const countriesDataSource = useAsyncDataSource(
        {
            api: () => svc.api.demo.countries({ sorting: [{ field: 'name' }] }).then((r: LazyDataSourceApiResponse<Country>) => r.items),
        },
        [],
    );

    const { lens, save, close } = useForm<Person>({
        value: {},
        onSave: (person) => Promise.resolve({ form: person }),
        onSuccess: (person) => modalProps.success(person),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: true },
                sex: { isRequired: true },
            },
        }),
    });

    // It shows 'Leave with unsaved changes' dialog when a user tries to close modal with unsaved form
    const closeModalWithFormSave = useCallback(() => close().then(modalProps.abort).catch(() => {}), [modalProps.abort, close]);

    return (
        <ModalBlocker { ...modalProps } abort={ closeModalWithFormSave }>
            <ModalWindow>
                <ModalHeader borderBottom title="New committee" onClose={ closeModalWithFormSave } />
                <ScrollBars>
                    <Panel background="surface-main">
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={ 1 }>
                                <LabeledInput label="First Name" { ...lens.prop('firstName').toProps() }>
                                    <TextInput placeholder="First Name" { ...lens.prop('firstName').toProps() } />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={ 1 }>
                                <LabeledInput label="Last Name" { ...lens.prop('lastName').toProps() }>
                                    <TextInput placeholder="Last Name" { ...lens.prop('lastName').toProps() } />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={ 1 }>
                                <LabeledInput label="Country" { ...lens.prop('countryId').toProps() }>
                                    <PickerInput { ...lens.prop('countryId').toProps() } selectionMode="single" valueType="id" dataSource={ countriesDataSource } />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={ 1 }>
                                <LabeledInput label="Sex" { ...lens.prop('sex').toProps() }>
                                    <FlexRow>
                                        <RadioGroup
                                            name="gender"
                                            items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                                            { ...lens.prop('sex').toProps() }
                                            direction="horizontal"
                                        />
                                    </FlexRow>
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                    </Panel>
                    <ModalFooter borderTop cx={ css.footer }>
                        <Button color="secondary" fill="outline" onClick={ closeModalWithFormSave } caption="Cancel" />
                        <Button color="primary" caption="Confirm" onClick={ save } />
                    </ModalFooter>
                    <FlexSpacer />
                </ScrollBars>
            </ModalWindow>
        </ModalBlocker>
    );
}

export default function ModalWithFormExampleToggler() {
    const svc = useUuiContext();

    return (
        <Button
            caption="Show modal"
            onClick={ () =>
                svc.uuiModals
                    .show((props) => <ModalWithFormExample { ...props } />)
                    .then((person) =>
                        svc.uuiNotifications.show(
                            (props) => (
                                <SuccessNotification { ...props }>
                                    <Text>Data has been saved!</Text>
                                    <Text>
                                        Person:
                                        {JSON.stringify(person)}
                                    </Text>
                                </SuccessNotification>
                            ),
                            { duration: 2 },
                        ))
                    .catch(() => {}) }
        />
    );
}
