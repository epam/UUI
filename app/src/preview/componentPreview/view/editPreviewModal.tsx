import { IModal } from '@epam/uui-core';
import { TComponentPreviewParams } from '../types';
import {
    Button,
    Checkbox,
    FlexCell,
    FlexRow, FlexSpacer,
    LabeledInput,
    ModalBlocker, ModalFooter,
    ModalHeader,
    ModalWindow, Panel, PickerInput, ScrollBars,
    useForm,
} from '@epam/uui';
import { componentItems, componentsPreviewMap, getDefaultPreviewId } from '../utils/previewUtils';
import { useArrayDataSource } from '@epam/uui-core';
import { TTheme } from '../../../common/docs/docsConstants';
import React from 'react';

const title = 'Edit';

export function EditPreviewModal(modalProps: IModal<TComponentPreviewParams>) {
    const { lens, save, close } = useForm<TComponentPreviewParams>({
        value: { ...modalProps.parameters },
        onSave: (params) => Promise.resolve({ form: params }),
        onSuccess: (params) => modalProps.success(params),
        getMetadata: () => ({
            props: {
                componentId: { isRequired: true },
                previewId: { isRequired: true },
                theme: { isRequired: true },
                isSkin: { isRequired: true },
            },
        }),
    });

    const componentId = lens.toProps().value.componentId;
    const previewItems = componentsPreviewMap.get(componentId)?.previewIds || [];

    const dsComponents = useArrayDataSource({ items: componentItems }, [componentItems]);
    const dsPreview = useArrayDataSource<{ id: string, name: string }, unknown, unknown>({ items: previewItems }, [previewItems]);
    const dsThemes = useArrayDataSource({ items: Object.values(TTheme).map((id) => ({ id, name: id })) }, []);

    const handleComponentIdChange = (newComponentId: string) => {
        if (componentId !== newComponentId) {
            const newPreviewId = getDefaultPreviewId(newComponentId);
            lens.prop('previewId').toProps().onValueChange(newPreviewId);
        }
        lens.prop('componentId').toProps().onValueChange(newComponentId);
    };

    const renderInput = (params: { name: (keyof TComponentPreviewParams), label: string, input: React.ReactNode }) => {
        const { name, label, input } = params;
        return (
            <FlexRow vPadding="12">
                <FlexCell grow={ 1 }>
                    <LabeledInput
                        labelPosition="top"
                        label={ label }
                        { ...lens.prop(name).toProps() }
                    >
                        { input }
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        );
    };

    return (
        <ModalBlocker { ...modalProps } abort={ () => close().then(modalProps.abort).catch(() => {}) }>
            <ModalWindow>
                <ModalHeader borderBottom title={ title } onClose={ () => close().then(modalProps.abort).catch(() => {}) } />
                <ScrollBars>
                    <Panel background="surface-main" margin="24">
                        {
                            renderInput({
                                name: 'theme',
                                label: 'Theme',
                                input: (
                                    <PickerInput
                                        { ...lens.prop('theme').toProps() }
                                        rawProps={ {
                                            input: { 'aria-label': 'Theme' },
                                        } }
                                        disableClear={ true }
                                        selectionMode="single"
                                        valueType="id"
                                        dataSource={ dsThemes }
                                    />
                                ),
                            })
                        }
                        {
                            renderInput({
                                name: 'isSkin',
                                label: 'isSkin',
                                input: (
                                    <Checkbox
                                        rawProps={ { 'aria-label': 'isSkin' } }
                                        { ...lens.prop('isSkin').toProps() }
                                    />
                                ),
                            })
                        }
                        {
                            renderInput({
                                name: 'componentId',
                                label: 'Component ID',
                                input: (
                                    <PickerInput
                                        rawProps={ {
                                            input: { 'aria-label': 'Component ID' },
                                        } }
                                        size="30"
                                        dataSource={ dsComponents }
                                        value={ lens.prop('componentId').toProps().value }
                                        onValueChange={ handleComponentIdChange }
                                        getName={ (item) => item.name }
                                        selectionMode="single"
                                        valueType="id"
                                        disableClear={ true }
                                    />
                                ),
                            })
                        }
                        {
                            renderInput({
                                name: 'previewId',
                                label: 'Preview ID',
                                input: (
                                    <PickerInput
                                        rawProps={ {
                                            input: { 'aria-label': 'Preview ID' },
                                        } }
                                        isDisabled={ !lens.prop('componentId').toProps().value }
                                        size="30"
                                        dataSource={ dsPreview }
                                        value={ lens.prop('previewId').toProps().value }
                                        onValueChange={ lens.prop('previewId').toProps().onValueChange }
                                        getName={ (item) => item.name }
                                        selectionMode="single"
                                        valueType="id"
                                        disableClear={ true }
                                    />
                                ),
                            })
                        }
                    </Panel>
                    <ModalFooter borderTop>
                        <FlexSpacer />
                        <Button color="secondary" fill="outline" onClick={ () => close().then(modalProps.abort) } caption="Cancel" />
                        <Button color="accent" caption="Confirm" onClick={ save } />
                    </ModalFooter>
                    <FlexSpacer />
                </ScrollBars>
            </ModalWindow>
        </ModalBlocker>
    );
}
