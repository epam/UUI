import {
    Button, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, ScrollBars,
} from '@epam/promo';
import { FlexSpacer } from '@epam/uui-components';
import React, { useCallback, useEffect, useState } from 'react';
import { IModal } from '@epam/uui-core';
import { SlateEditor, toDoListPlugin, attachmentPlugin, imagePlugin, videoPlugin, linkPlugin, iframePlugin,
    notePlugin, separatorPlugin, headerPlugin, colorPlugin, superscriptPlugin, listPlugin, quotePlugin, tablePlugin,
    codeBlockPlugin,
    defaultPlugins,
    baseMarksPlugin,
} from '@epam/uui-editor';

interface IDemoItemDescriptionModal {
    modalProps: IModal<any>;
    demoItemName: string;
    value: any;
}

function isReadOnly() {
    return !window.location.host.includes('localhost');
}

export function DescriptionModal(props: IDemoItemDescriptionModal) {
    const { modalProps, demoItemName } = props;
    const [valueLocal, setValueLocal] = useState(null);

    useEffect(() => {
        setValueLocal(props.value);
    }, [props.value]);

    const handleClose = useCallback(() => {
        modalProps.abort();
    }, [modalProps]);

    const handleSaveAndClose = useCallback(async () => {
        modalProps.success(valueLocal);
    }, [modalProps, valueLocal]);

    const plugins = [
        ...defaultPlugins,
        ...baseMarksPlugin(),
        headerPlugin(),
        colorPlugin(),
        superscriptPlugin(),
        listPlugin(),
        toDoListPlugin(),
        linkPlugin(),
        quotePlugin(),
        attachmentPlugin(),
        imagePlugin(),
        videoPlugin(),
        iframePlugin(),
        notePlugin(),
        separatorPlugin(),
        tablePlugin(),
        codeBlockPlugin(),
    ];

    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow width={ 600 } height="auto">
                <ModalHeader borderBottom title={ demoItemName } onClose={ handleClose } />
                <ScrollBars>
                    <SlateEditor
                        placeholder="Please type"
                        plugins={ plugins }
                        mode="inline"
                        isReadonly={ isReadOnly() }
                        minHeight={ 400 }
                        fontSize="14"
                        value={ valueLocal }
                        onValueChange={ setValueLocal }
                    />
                </ScrollBars>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="gray" fill="white" caption="Cancel" onClick={ handleClose } />
                    {!isReadOnly() && <Button color="primary" caption="Save" onClick={ handleSaveAndClose } />}
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
