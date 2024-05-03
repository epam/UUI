import { IModal, useUuiContext } from '@epam/uui-core';
import React, { useState } from 'react';
import { PlateEditor, createPluginFactory, setElements, getBlockAbove, insertEmptyElement } from '@udecode/plate-common';
import { ReactComponent as TypeRefTableIcon } from '../../icons/add-type-ref-table.svg';
import { TypeRefTable } from './TypeRefTable';
import { FlexSpacer, ModalBlocker, ModalWindow, ModalHeader, FlexRow, Button, ModalFooter, LabeledInput, TextInput } from '@epam/uui';
import { PARAGRAPH_TYPE, ToolbarButton } from '@epam/uui-editor';
import { useDocsGenForType, useDocsGenSummaries } from './dataHooks';

const TYPE_REF_TABLE_KEY = 'type-ref-table';

export const typeRefRTEPlugin = () => {
    const createImagePlugin = createPluginFactory({
        key: TYPE_REF_TABLE_KEY,
        type: TYPE_REF_TABLE_KEY,
        isElement: true,
        isVoid: true,
        component: TypeRefPluginComponent,
        options: {
            bottomBarButton: AddTypeRefTableButton,
        },
        handlers: {
            onKeyDown: (editor) => (event) => {
                const typeRefEntry = getBlockAbove(editor, { match: { type: TYPE_REF_TABLE_KEY } });
                if (!typeRefEntry) return;

                if (event.key === 'Enter') {
                    return insertEmptyElement(editor, PARAGRAPH_TYPE);
                }
            },
            onCopy: () => (e) => e.stopPropagation(), // fix crash when copy table text in edit mode
        },
    });

    return createImagePlugin();
};

interface AddTypeRefTableButtonProps {
    editor: PlateEditor;
}

function TypeRefPluginComponent(props: any) {
    const docsGenType = useDocsGenForType(props.element.data.typePath);
    const docsGenSummaries = useDocsGenSummaries();

    return (
        <>
            <TypeRefTable
                rawProps={ { ...props.attributes, contentEditable: false } }
                docsGenType={ docsGenType }
                docsGenSummaries={ docsGenSummaries }
                isGrouped={ false }
            />
            {props.children}
        </>
    );
}

function AddTypeRefTableButton({ editor }: AddTypeRefTableButtonProps) {
    const context = useUuiContext();

    return (
        <ToolbarButton
            onClick={ async (event) => {
                if (!editor) return;
                event.preventDefault();

                context.uuiModals.show<string>((modalProps) => (
                    <AddTypeRefTableModal
                        editor={ editor }
                        { ...modalProps }
                    />
                )).catch(() => null);
            } }
            icon={ TypeRefTableIcon }
        />
    );
}

interface AddTypeRefTableModalProps extends IModal<any> {
    editor: PlateEditor;
}
export function AddTypeRefTableModal({ editor, success, abort, ...props }: AddTypeRefTableModalProps) {
    const [typePath, setTypePath] = useState('');

    const createTypeRefTableBlock = () => {
        setElements(editor, {
            type: TYPE_REF_TABLE_KEY,
            data: { typePath: typePath },
            children: [{ text: '' }],
        });

        success(true);
    };

    return (
        <ModalBlocker { ...props } success={ success } abort={ abort }>
            <ModalWindow>
                <ModalHeader title="Add type ref table" onClose={ abort } />
                <FlexRow padding="12">
                    <LabeledInput label="Type path(e.g: @epam/uui-core:DataSourceState)">
                        <TextInput value={ typePath } onValueChange={ setTypePath } autoFocus />
                    </LabeledInput>
                </FlexRow>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="secondary" fill="outline" caption="Cancel" onClick={ () => abort() } />
                    <Button
                        color="primary"
                        caption="Ok"
                        isDisabled={ !typePath }
                        onClick={ createTypeRefTableBlock }
                    />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
