import { Editor, RenderInlineProps } from "slate-react";
import { Editor as CoreEditor } from "slate";
import * as React from "react";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { isTextSelected } from '../../helpers';
import { PlaceholderBlock } from './PlaceholderBlock';
import { Dropdown } from "@epam/uui-components";
import * as css from './PlaceholderPlugin.scss';

export interface PlaceholderPluginParams {
    items: {
        name: string;
        [key: string]: any;
    }[];
}

export const placeholderPlugin = (params: PlaceholderPluginParams) => {
    const renderInline = (props: RenderInlineProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'placeholder':
                return <PlaceholderBlock { ...props } />;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {

        if (event.keyCode == 13 && editor.value.focusBlock.type === 'placeholder') {
            return (editor as any).insertEmptyBlock(editor);
        }

        next();
    };

    const renderDropdownBody = (editor: Editor) => {
        return (
            <div className={ css.dropdownContainer }>
                { params.items.map(i =>
                    <div className={ css.dropdownItem } onClick={ () => editor.insertInline((editor as any).createInline(i, 'placeholder')) }>
                        { i.name }
                    </div>,
                ) }
            </div>
        );
    };

    const InsertPlaceholderButton = (props: { editor: Editor }) => {
        return (
            <Dropdown
                renderTarget={ (targetProps) => <ToolbarButton
                    caption='Insert Placeholder'
                    isDisabled={ isTextSelected(props.editor) }
                    { ...targetProps }
                /> }
                renderBody={ () => renderDropdownBody(props.editor) }
                placement='top-start'
                modifiers={ { offset: { offset: '0 3px' } } }
            />
        );
    };

    return {
        renderInline,
        onKeyDown,
        sidebarButtons: [InsertPlaceholderButton],
    };
};

