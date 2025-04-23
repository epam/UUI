import React from 'react';
import { useAsyncDataSource, useForm, useUuiContext } from '@epam/uui-core';
import {
    Button, Checkbox, Switch, TextInput, SuccessNotification, ErrorNotification, Text, LabeledInput, Panel, PickerInput,
    FlexRow, FlexCell, FlexSpacer, RadioGroup, ScrollBars, IconButton, ModalBlocker, ModalWindow, ModalHeader, Badge, DatePicker,
    PromoButton,
} from '@epam/electric';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-18.svg';
import { ReactComponent as CrossIcon } from '@epam/assets/icons/common/navigation-close-24.svg';
import { ReactComponent as LocationIcon } from '@epam/assets/icons/common/communication-geo_tag-18.svg';
import { Country } from '@epam/uui-docs';

interface Person {
    firstName?: string;
    lastName?: string;
    gender?: string;
    visaRecords?: Array<{ country?: Country; term?: { from: string; to: string } }>;
    processingPersonalDataAgreed?: boolean;
    displayAdsAgreed?: boolean;
}

export function ThemeElectricDemo() {
    const svc = useUuiContext();

    const countryDataSource = useAsyncDataSource<Country, string, unknown>(
        {
            api: () => svc.api.demo.countries({}).then((r: any) => r.items),
        },
        [],
    );

    const showModal = () =>
        svc.uuiModals.show((props) => (
            <ModalBlocker { ...props }>
                <ModalWindow width={ 360 }>
                    <ModalHeader borderBottom title="Simple modal example " onClose={ () => props.abort() } />
                    <ScrollBars>
                        <Panel background="surface-main" margin="24">
                            <Text color="primary" fontSize="16">
                                Changes will be undone!
                            </Text>
                        </Panel>
                    </ScrollBars>
                </ModalWindow>
            </ModalBlocker>
        ));

    const { lens, save } = useForm<Person>({
        value: {
            visaRecords: [
                {
                    country: null,
                    term: {
                        from: undefined,
                        to: undefined,
                    },
                },
            ],
            processingPersonalDataAgreed: false,
        },
        onSave: (person) => Promise.resolve({ form: person }) /* place your save api call here */,
        getMetadata: () => ({
            props: {
                firstName: { isRequired: true },
                lastName: { isRequired: true },
                gender: { isRequired: true },
                processingPersonalDataAgreed: { isRequired: true },
                displayAdsAgreed: { isRequired: true },
                visaRecords: {
                    all: {
                        props: {
                            country: {
                                isRequired: true,
                            },
                        },
                    },
                },
            },
        }),
        settingsKey: 'theme-electric-demo',
    });

    const renderDemoForm = () => {
        return (
            <FlexRow vPadding="24" padding="24">
                <FlexCell width={ 600 } minWidth={ 600 }>
                    <Text color="primary" lineHeight="30" fontSize="24" fontWeight="600">
                        Personal Info
                    </Text>
                    <FlexRow vPadding="36">
                        <SuccessNotification id={ 1 } key="1" onSuccess={ () => {} } onClose={ () => {} }>
                            <Text fontSize="14">
                                Data has been saved!
                            </Text>
                        </SuccessNotification>
                    </FlexRow>
                    <FlexRow vPadding="36">
                        <ErrorNotification
                            id={ 1 }
                            key="1"
                            onSuccess={ () => {} }
                            onClose={ () => {} }
                            actions={ [{ name: 'Restore', action: () => {} }, { name: 'Cancel', action: () => {} }] }
                        >
                            <Text size="36" fontSize="14">
                                Data hasn't been saved! Please choose something!
                            </Text>
                        </ErrorNotification>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="First Name" { ...lens.prop('firstName').toProps() }>
                                <TextInput placeholder="First Name" { ...lens.prop('firstName').toProps() } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <FlexCell grow={ 1 }>
                            <LabeledInput label="Last Name" { ...lens.prop('lastName').toProps() }>
                                <TextInput placeholder="Last Name" { ...lens.prop('lastName').toProps() } />
                            </LabeledInput>
                        </FlexCell>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <LabeledInput label="Gender" { ...lens.prop('gender').toProps() }>
                            <RadioGroup
                                name="gender"
                                direction="horizontal"
                                { ...lens.prop('gender').toProps() }
                                items={ [{ id: 'male', name: 'Male' }, { id: 'female', name: 'Female' }] }
                            />
                        </LabeledInput>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <LabeledInput label="Status">
                            <FlexRow columnGap="12">
                                <Badge color="success" fill="outline" caption="Approved" size="24" />
                                <Badge color="info" fill="outline" caption="Active" size="24" />
                            </FlexRow>
                        </LabeledInput>
                    </FlexRow>
                    <FlexRow vPadding="24">
                        <Text color="primary" lineHeight="30" fontSize="24" fontWeight="600">
                            Visa records
                        </Text>
                    </FlexRow>
                    {lens
                        .prop('visaRecords')
                        .get()
                        .map((record, index) => {
                            return (
                                <FlexRow key={ index } columnGap="12" vPadding="12" alignItems="top">
                                    <FlexCell width={ 242 }>
                                        <LabeledInput label="Country" { ...lens.prop('visaRecords').index(index).prop('country').toProps() }>
                                            <PickerInput<Country, string>
                                                dataSource={ countryDataSource }
                                                { ...lens.prop('visaRecords').index(index).prop('country').toProps() }
                                                entityName="Country"
                                                selectionMode="single"
                                                valueType="entity"
                                                icon={ LocationIcon }
                                            />
                                        </LabeledInput>
                                    </FlexCell>
                                    <FlexCell grow={ 1 } rawProps={ { style: { width: '310px' } } }>
                                        <LabeledInput label="Term">
                                            <FlexRow columnGap="6">
                                                <FlexCell width={ 152 }>
                                                    <DatePicker
                                                        placeholder="From:"
                                                        { ...lens.prop('visaRecords').index(index).prop('term').prop('from')
                                                            .toProps() }
                                                    />
                                                </FlexCell>
                                                <FlexCell width={ 152 }>
                                                    <DatePicker
                                                        placeholder="To:"
                                                        { ...lens.prop('visaRecords').index(index).prop('term').prop('to')
                                                            .toProps() }
                                                    />
                                                </FlexCell>
                                            </FlexRow>
                                        </LabeledInput>
                                    </FlexCell>
                                    <FlexRow alignItems="center" rawProps={ { style: { marginTop: '24px' } } }>
                                        <IconButton
                                            icon={ CrossIcon }
                                            onClick={ () =>
                                                lens.prop('visaRecords').set(
                                                    lens
                                                        .prop('visaRecords')
                                                        .get()
                                                        .filter((_, i) => index !== i),
                                                ) }
                                        />
                                    </FlexRow>
                                </FlexRow>
                            );
                        })}
                    <FlexRow vPadding="24">
                        <Button
                            caption="Add one more"
                            icon={ AddIcon }
                            color="primary"
                            fill="outline"
                            onClick={ () =>
                                lens.prop('visaRecords').set(
                                    lens
                                        .prop('visaRecords')
                                        .get()
                                        .concat({ country: null, term: { from: '', to: '' } }),
                                ) }
                        />
                    </FlexRow>
                    <FlexRow vPadding="24">
                        <Text color="primary" lineHeight="30" fontSize="24" fontWeight="600">
                            Agreement
                        </Text>
                    </FlexRow>
                    <FlexRow vPadding="12">
                        <Checkbox label="I agree to the processing of personal data" { ...lens.prop('processingPersonalDataAgreed').toProps() } />
                    </FlexRow>
                    <FlexRow vPadding="12" borderBottom>
                        <Switch label="I agree to display ads" { ...lens.prop('displayAdsAgreed').toProps() } />
                    </FlexRow>
                    <FlexRow vPadding="24" columnGap="12">
                        <FlexSpacer />
                        <Button caption="Cancel" onClick={ showModal } color="secondary" fill="outline" />
                        <Button caption="SAVE" onClick={ save } color="primary" />
                    </FlexRow>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <div className="uui-theme-electric" style={ { height: 'calc(100vh - 60px)', margin: '0 auto', display: 'flex', flexDirection: 'column' } }>
            <div style={ { background: 'var(--uui-neutral-80)', marginTop: '12px' } }>
                <FlexRow columnGap="12" vPadding="24" padding="12">
                    <PromoButton caption="BUTTON" size="36" onClick={ () => {} } />
                    <PromoButton caption="BUTTON" size="36" isDisabled onClick={ () => {} } />
                    <PromoButton caption="BUTTON" size="42" onClick={ () => {} } />
                    <PromoButton caption="BUTTON" size="42" isDisabled onClick={ () => {} } />
                </FlexRow>
            </div>
            <Panel background="surface-main" shadow rawProps={ { style: { margin: '24px auto' } } }>
                <ScrollBars>{renderDemoForm()}</ScrollBars>
            </Panel>
        </div>
    );
}
