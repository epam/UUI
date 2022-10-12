import {
    Button,
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Panel,
    ScrollBars,
} from "@epam/promo";
import { FlexSpacer } from "@epam/uui-components";
import React from "react";
import { DemoItem } from "../../../demo/structure";
import { IModal } from "@epam/uui-core";
import { EditableDocContent } from "../../docs";


interface IDemoItemDescriptionModal {
    modalProps: IModal<string>;
    demoItem: DemoItem;
}

export function getDemoDescriptionFileName(demoItemName: string) {
    const itemNameNormalized = demoItemName.replace(/\s/g, '');
    return `demo-${itemNameNormalized}-description`;
}

export function DemoItemDescriptionModal(props: IDemoItemDescriptionModal) {
    const {
        modalProps,
        demoItem,
    } = props;

    const title = demoItem.name;
    const docFileName = getDemoDescriptionFileName(demoItem.name);

    return (
        <ModalBlocker blockerShadow="dark" { ...modalProps }>
            <ModalWindow width="600" height="auto">
                <ModalHeader borderBottom title={ title } onClose={ () => modalProps.abort() } />
                <ScrollBars hasTopShadow hasBottomShadow >
                    <Panel>
                        <EditableDocContent
                            fileName={ docFileName }
                            isWidthByContainer={ true }
                            minHeight={ 400 }
                        />
                    </Panel>
                </ScrollBars>
                <ModalFooter borderTop>
                    <FlexSpacer />
                    <Button color="gray50" fill="white" caption='Close' onClick={ () => modalProps.abort() } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
