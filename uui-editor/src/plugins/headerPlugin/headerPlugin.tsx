import { RenderBlockProps } from "slate-react";
import { Block, Editor as CoreEditor, KeyUtils } from "slate";
import * as headlinePickerIcon from "../../icons/heading.svg";
import * as React from "react";
import { HeaderBar } from "../../implementation/HeaderBar";
import { headerBlocks } from "../../implementation/HeaderBar";
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { Dropdown } from '@epam/uui-components';
import { getBlockDesirialiser } from '../../helpers';

export const headerPlugin = () => {
    const renderBlock = (props: RenderBlockProps, editor: CoreEditor, next: () => any) => {
        switch (props.node.type) {
            case 'uui-richTextEditor-header-1':
                return <h1 { ...props.attributes }>{ props.children }</h1>;
            case 'uui-richTextEditor-header-2':
                return <h2 { ...props.attributes }>{ props.children }</h2>;
            case 'uui-richTextEditor-header-3':
                return <h3 { ...props.attributes }>{ props.children }</h3>;
            case 'uui-richTextEditor-header-4':
                return <h4 { ...props.attributes }>{ props.children }</h4>;
            case 'uui-richTextEditor-header-5':
                return <h5 { ...props.attributes }>{ props.children }</h5>;
            case 'uui-richTextEditor-header-6':
                return <h6 { ...props.attributes }>{ props.children }</h6>;
            default:
                return next();
        }
    };

    const onKeyDown = (event: KeyboardEvent, editor: CoreEditor, next: () => any) => {
        const { value } = editor;

        if (event.keyCode === 13 && ((editor as any).hasMark(headerBlocks))) {
            const emptyParagraph = Block.create({
                object: 'block',
                type: 'paragraph',
                key: KeyUtils.create(),
            });

            return editor.insertBlock(emptyParagraph);
        }

        return next();
    };

    return {
        renderBlock,
        onKeyDown,
        sidebarButtons: [HeaderButton],
        serializers: [headerDesializer],
    };
};

const HeaderButton = (editorProps: { editor: any }) => {
    return <Dropdown
        renderTarget={ (props) => <ToolbarButton
            icon={ headlinePickerIcon }
            isActive={ editorProps.editor.hasBlock(headerBlocks) }
            onClick={ () => null }
            { ...props }
        /> }
        renderBody={ (props) => <HeaderBar editor={ editorProps.editor } { ...props } /> }
        placement='top-start'
        modifiers={ { offset: { offset: '0 3px' } } }
    />;
};

const HEADER_TAGS: any = {
    h1: 'uui-richTextEditor-header-1',
    h2: 'uui-richTextEditor-header-2',
    h3: 'uui-richTextEditor-header-3',
    h4: 'uui-richTextEditor-header-4',
    h5: 'uui-richTextEditor-header-5',
    h6: 'uui-richTextEditor-header-6',
};

const headerDesializer = getBlockDesirialiser(HEADER_TAGS);