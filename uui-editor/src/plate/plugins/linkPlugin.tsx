import React from 'react';
import {
    getPluginType,
    MarkToolbarButton,
    isMarkActive,
    createLinkPlugin,
    someNode,
    useEventPlateId,
    usePlateEditorState,
    withPlateEventProvider,
    getAndUpsertLink,
    ELEMENT_LINK,
    ToolbarButton as PlateToolbarButton,
    ToolbarButtonProps, focusEditor,
} from "@udecode/plate";

import { ToolbarButton as UUIToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as LinkIcon } from "../icons/link.svg";
import { AddLinkModal } from "../implementation/AddLinkModal";
import { useUuiContext } from "@epam/uui-core";
import { isPluginActive } from "../../helpers";

export const createUUILinkPlugin = createLinkPlugin({
    type: 'link',
});

export const ToolbarButton = withPlateEventProvider(
    ({ id, getLinkUrl, ...props }: any) => {
        const context = useUuiContext();
        id = useEventPlateId(id);
        const editor = usePlateEditorState(id)!;

        const type = getPluginType(editor, ELEMENT_LINK);
        const isLink = !!editor?.selection && someNode(editor, { match: { type } });

        if (!isPluginActive(ELEMENT_LINK)) return null;

        return (
            <PlateToolbarButton
                styles={ { root: {width: 'auto', cursor: 'pointer' }} }
                active={ isLink }
                onMouseDown={ async (event) => {
                    if (!editor) return;

                    event.preventDefault();
                    context.uuiModals.show<string>((modalProps): any => (
                        <AddLinkModal
                            editor={ editor }
                            success={ () => {} }
                            abort={ () => context.uuiModals.closeAll() }
                            isActive={ true }
                            key='image'
                            zIndex={ 100 }
                            { ...modalProps }
                        />
                    ));
                } }
                icon={ <UUIToolbarButton
                    onClick={ () => {} }
                    icon={ LinkIcon }
                    isActive={ !!editor?.selection && isMarkActive(editor, 'uui-richTextEditor-bold'!) }
                /> }
            />
        );
    },
);
