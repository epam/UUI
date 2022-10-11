import {
    Button,
    FlexRow,
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
import { Value } from "slate";
import { EditableDocContent } from "../../docs";


interface IDemoItemDescriptionModal {
    modalProps: IModal<string>;
    demoItem: DemoItem;
}

export function DemoItemDescriptionModal(props: IDemoItemDescriptionModal) {
    const {
        modalProps,
        demoItem,
    } = props;
    const [value, setValue] = React.useState();

    const handleValueChange = React.useCallback((calue: Value) => {
        setValue(value);
    }, []);

    const title = demoItem.name;
    const itemNameNormalized = demoItem.name.replace(/\s/g, '');
    const docFileName = `demo-${itemNameNormalized}-description`;

    return (
        <ModalBlocker blockerShadow="dark" { ...modalProps }>
            <ModalWindow width="600" height="auto">
                <ModalHeader borderBottom title={ title } onClose={ () => modalProps.abort() } />
                <ScrollBars hasTopShadow hasBottomShadow >
                    <Panel>
                        <FlexRow padding='24'>
                            <EditableDocContent
                                fileName={ docFileName }
                                isWidthByContainer={ true }
                                minHeight={ 400 }
                            />
                        </FlexRow>
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
