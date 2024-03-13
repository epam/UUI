import * as React from 'react';
import { Button, FlexRow, IconContainer, LabeledInput, Panel, Text, TextArea, Tooltip } from '@epam/uui';
import { ReactComponent as ErrIcon } from '@epam/assets/icons/common/notification-error-fill-24.svg';
import { ReactComponent as InfoIcon } from '@epam/assets/icons/common/notification-info-fill-24.svg';
//
import css from './previewToolbar.module.scss';
import { useUuiContext } from '@epam/uui-core';
import { useMemo, useState } from 'react';
import { TComponentPreviewParams } from '../types';
import { EditPreviewModal } from './editPreviewModal';
import { componentItems, componentsPreviewMap } from '../utils/previewUtils';

interface IPreviewToolbar {
    value: TComponentPreviewParams;
    onValueChange: (value: TComponentPreviewParams) => void;
    fields: {
        label: string;
        value: unknown;
        hasError?: boolean;
        tooltip?: string | undefined
    }[];
}

export function PreviewToolbar(props: IPreviewToolbar) {
    const [isEditingInline, setIsEditingInline] = useState<boolean>(false);
    const { fields, onValueChange } = props;
    const svc = useUuiContext();
    const modalValue = useMemo(() => normalizeModalValue(props.value), [props.value]);
    const [inlineEditorValue, setInlineEditorValue] = useState<string>('');

    const handleOpenModal = () => {
        svc.uuiModals
            .show<TComponentPreviewParams>((props) => <EditPreviewModal { ...props } />, modalValue)
            .then((newProps) => {
                onValueChange(newProps);
            })
            .catch(() => {});
    };

    const renderTooltipContent = () => {
        const allFields = fields.map((field) => {
            const { label, value, hasError, tooltip } = field;
            return (
                <LabeledInput
                    key={ label }
                    cx={ [css.root, hasError && css.hasError] }
                    label={ label }
                    labelPosition="left"
                >
                    <FlexRow columnGap="12">
                        <Text color={ hasError ? 'critical' : 'primary' }>{value as string}</Text>
                        {
                            tooltip && (
                                <Tooltip color={ hasError ? 'critical' : undefined } content={ tooltip }>
                                    {
                                        hasError
                                            ? <IconContainer icon={ ErrIcon } />
                                            : <IconContainer icon={ InfoIcon } />
                                    }
                                </Tooltip>
                            )
                        }
                    </FlexRow>
                </LabeledInput>
            );
        });
        return (
            <Panel background="surface-main">
                { allFields }
            </Panel>
        );
    };

    const renderFields = () => {
        if (isEditingInline) {
            return (
                <TextArea
                    rows={ 7 }
                    cx={ css.textarea }
                    rawProps={ {
                        spellCheck: 'false',
                    } }
                    size="30"
                    value={ inlineEditorValue }
                    onValueChange={ setInlineEditorValue }
                />
            );
        }
        return null;
    };

    const renderButtons = () => {
        if (isEditingInline) {
            return (
                <FlexRow columnGap="6">
                    <Button
                        caption="Cancel"
                        fill="outline"
                        size="24"
                        onClick={ () => {
                            setInlineEditorValue('');
                            setIsEditingInline(false);
                        } }
                        cx={ css.button }
                    />
                    <Button
                        caption="Apply"
                        fill="solid"
                        color="primary"
                        size="24"
                        cx={ css.button }
                        onClick={ () => {
                            props.onValueChange(jsonParse(inlineEditorValue) as TComponentPreviewParams);
                            setInlineEditorValue('');
                            setIsEditingInline(false);
                        } }
                    />
                </FlexRow>
            );
        }

        return (
            <FlexRow columnGap="6">
                <Tooltip
                    content={ renderTooltipContent() }
                    color="neutral"
                    closeOnMouseLeave="boundary"
                >
                    <Button
                        caption="Edit"
                        fill="outline"
                        size="24"
                        onClick={ handleOpenModal }
                        cx={ css.button }
                    />
                </Tooltip>
                <Button
                    caption="Edit Inline"
                    fill="outline"
                    size="24"
                    onClick={ () => {
                        setInlineEditorValue(jsonStringify(modalValue));
                        setIsEditingInline(true);
                    } }
                    cx={ css.button }
                />
            </FlexRow>
        );
    };

    return (
        <>
            {
                renderButtons()
            }
            {
                renderFields()
            }
        </>
    );
}

function normalizeModalValue(propsValue: TComponentPreviewParams): TComponentPreviewParams {
    let componentId: string;
    if (propsValue.componentId && componentItems.find((i) => i.id === propsValue.componentId)) {
        componentId = propsValue.componentId;
    }
    const previewItems = componentsPreviewMap.get(componentId)?.previewIds || [];

    let previewId: string;
    if (propsValue.previewId && previewItems.find((i) => i.id === propsValue.previewId)) {
        previewId = propsValue.previewId;
    }
    return {
        ...propsValue,
        componentId,
        previewId,
    };
}

function jsonStringify(json: object): string {
    return JSON.stringify(json, undefined, 1);
}

function jsonParse(json: string): object {
    try {
        return JSON.parse(json);
    } catch (err) {}
    return {};
}
