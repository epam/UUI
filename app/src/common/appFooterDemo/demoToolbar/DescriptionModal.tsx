import * as css from './DescriptionModal.scss';
import { Button, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, ScrollBars } from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import React, { useCallback, useState } from "react";
import { DemoItem } from "../../../demo/structure";
import { IModal } from "@epam/uui-core";
import { EditableDocContent, EditableDocContentApi } from "../../docs";
import { Blocker } from "@epam/loveship";

interface IDemoItemDescriptionModal {
    modalProps: IModal<string>;
    demoItem: DemoItem;
}

export function getDemoDescriptionFileName(demoItemName: string) {
    const itemNameNormalized = demoItemName.replace(/\s/g, '');
    return `demo-${itemNameNormalized}-description`;
}

export function DescriptionModal(props: IDemoItemDescriptionModal) {
    const { modalProps, demoItem } = props;
    const [isLoading, setIsLoading] = useState(false);


    const editableDocContentApi = React.useRef<EditableDocContentApi>();

    const title = demoItem.name;
    const docFileName = getDemoDescriptionFileName(demoItem.name);

    const handleClose = useCallback(() => {
        modalProps.success('');
    }, [modalProps]);

    const handleSaveAndClose = useCallback(async () => {
        setIsLoading(true);
        try {
            await editableDocContentApi.current?.persistCurrentValue();
            setIsLoading(false);
            modalProps.success('');
        } catch {
            setIsLoading(false);
        }
    }, [modalProps]);

    return (
        <ModalBlocker blockerShadow="dark" { ...modalProps }>
            <ModalWindow width="600" height="auto">
                <ModalHeader borderBottom title={ title } onClose={ handleClose } />
                <ScrollBars hasTopShadow hasBottomShadow >
                    <EditableDocContent
                        apiRef={ editableDocContentApi }
                        minHeight={ 400 }
                        fileName={ docFileName }
                        wrapperCx={ css.wrapper }
                        editorCx={ css.editor }
                        isPersistOnChange={ false }
                    />
                    <Blocker isEnabled={ isLoading } />
                </ScrollBars>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="gray50" fill="white" caption='Cancel' onClick={ handleClose } />
                    <Button color="green" isDisabled={ isLoading } caption='Save' onClick={ handleSaveAndClose } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
