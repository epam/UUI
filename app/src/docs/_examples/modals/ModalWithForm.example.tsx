import React from 'react';
import { IModal, INotification, useUuiContext, useAsyncDataSource, LazyDataSourceApiResponse } from '@epam/uui';
import { Country } from '@epam/uui-docs';
import {
    ModalBlocker,
    ModalWindow,
    FlexSpacer,
    ModalHeader,
    FlexRow,
    LabeledInput,
    TextInput,
    Button,
    ScrollBars,
    ModalFooter,
    SuccessNotification,
    useForm,
    Text,
    Panel,
    FlexCell,
    ControlWrapper,
    RadioGroup,
    PickerInput,
} from '@epam/promo';

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
        []
    );

    const { lens, save, close } = useForm<Person>({
        value: {},
        onSave: person => Promise.resolve({ form: person }),
        onSuccess: person => modalProps.success(person),
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                countryId: { isRequired: true },
                sex: { isRequired: true },
            },
        }),
    });

    return (
        <ModalBlocker {...modalProps} abort={() => close().then(modalProps.abort)}>
            <ModalWindow>
                <ModalHeader borderBottom title="New committee" onClose={() => close().then(modalProps.abort)} />
                <ScrollBars>
                    <Panel>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={1}>
                                <LabeledInput label="First Name" {...lens.prop('firstName').toProps()}>
                                    <TextInput placeholder="First Name" {...lens.prop('firstName').toProps()} />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={1}>
                                <LabeledInput label="Last Name" {...lens.prop('lastName').toProps()}>
                                    <TextInput placeholder="Last Name" {...lens.prop('lastName').toProps()} />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={1}>
                                <LabeledInput label="Country" {...lens.prop('countryId').toProps()}>
                                    <PickerInput
                                        {...lens.prop('countryId').toProps()}
                                        selectionMode="single"
                                        valueType="id"
                                        dataSource={countriesDataSource}
                                    />
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                        <FlexRow padding="24" vPadding="12">
                            <FlexCell grow={1}>
                                <LabeledInput label="Sex" {...lens.prop('sex').toProps()}>
                                    <ControlWrapper size="36">
                                        <RadioGroup
                                            items={[
                                                { id: 'male', name: 'Male' },
                                                { id: 'female', name: 'Female' },
                                            ]}
                                            {...lens.prop('sex').toProps()}
                                            direction="horizontal"
                                        />
                                    </ControlWrapper>
                                </LabeledInput>
                            </FlexCell>
                        </FlexRow>
                    </Panel>
                    <ModalFooter borderTop>
                        <FlexSpacer />
                        <Button color="gray50" fill="white" onClick={() => close().then(modalProps.abort)} caption="Cancel" />
                        <Button color="green" caption="Confirm" onClick={save} />
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
            onClick={() =>
                svc.uuiModals
                    .show(props => <ModalWithFormExample {...props} />)
                    .then(person =>
                        svc.uuiNotifications.show(
                            props => (
                                <SuccessNotification {...props}>
                                    <Text>Data has been saved!</Text>
                                    <Text>Person: {JSON.stringify(person)}</Text>
                                </SuccessNotification>
                            ),
                            { duration: 2 }
                        )
                    )
            }
        />
    );
}
