import { Button, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, ScrollBars } from '@epam/promo';
import { FlexSpacer } from '@epam/uui-components';
import React, { useCallback, useEffect, useState } from 'react';
import { IModal } from '@epam/uui-core';
import { EditableDocContent } from '../../docs';
import { Value } from 'slate';
import { SlateEditor } from '@epam/uui-editor';

interface IDemoItemDescriptionModal {
    modalProps: IModal<Value>;
    demoItemName: string;
    value: Value;
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

    return (
        <ModalBlocker blockerShadow="dark" {...modalProps}>
            <ModalWindow width="600" height="auto">
                <ModalHeader borderBottom title={demoItemName} onClose={handleClose} />
                <ScrollBars hasTopShadow hasBottomShadow>
                    <SlateEditor
                        placeholder="Please type"
                        plugins={EditableDocContent.plugins}
                        mode="inline"
                        isReadonly={isReadOnly()}
                        minHeight={400}
                        fontSize="14"
                        value={valueLocal}
                        onValueChange={setValueLocal}
                    />
                </ScrollBars>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="gray50" fill="white" caption="Cancel" onClick={handleClose} />
                    {!isReadOnly() && <Button color="green" caption="Save" onClick={handleSaveAndClose} />}
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
