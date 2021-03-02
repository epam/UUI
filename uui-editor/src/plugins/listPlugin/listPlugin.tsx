import Lists from "@convertkit/slate-lists";
import { Editor as CoreEditor, Editor } from "slate";
import { RenderBlockProps } from "slate-react";
import * as listBulletIcon from "../../icons/bullet-list.svg";
import * as listNumberIcon from "../../icons/numbered-list.svg";
import * as React from "react";
import { ToolbarButton } from "../../implementation/ToolbarButton";
import { getBlockDesirialiser } from '../../helpers';

export const listPlugin = () => {
    const lists = Lists();
    const toggleListCommand = lists[0].commands.toggleList;
    lists[0].commands.wrapList = (editor: Editor, ...props: any[]) => {
        const type = props[0].type || 'unordered-list';
        const leafBlocks = editor.value.document.getLeafBlocksAtRange(editor.value.selection as any);

        editor.withoutNormalizing(() => {
            leafBlocks.forEach(block => {
                if (block.type == 'unordered-list' || block.type == 'ordered-list') return;
                editor.wrapBlockByKey(block.key, type);
                editor.wrapBlockByKey(block.key, 'list-item');
                editor.setNodeByKey(block.key, 'list-item-child');
            });
        });
    };
    lists[0].commands.toggleList = (editor: Editor, ...props: any[]) => {
        toggleListCommand(editor, ...props);
    };

    const isList = (editor: Editor, type: 'ordered-list' | 'unordered-list') => {
        let isActive = false;
        const blocks = editor.value.blocks;
        const document = editor.value.document;

        if (blocks.size > 0) {
            const parent: any = document.getParent(document.getParent(blocks.first().key).key);
            isActive = (editor as any).hasBlock(['list-item-child']) && parent && parent.type === type;
        }

        return isActive;
    };

    const onKeyDown = (event: KeyboardEvent, editor: Editor, next: () => any) => {
        const { value } = editor;

        if (new RegExp(/^[1-9]\.$/).test(value.anchorBlock.text)) {
            editor.moveToRangeOfNode(value.anchorBlock).delete();
            return (editor as any).toggleList({ type: 'ordered-list' });
        }

        if (new RegExp(/^-$/).test(value.anchorBlock.text)) {
            editor.moveToRangeOfNode(value.anchorBlock).delete();
            return (editor as any).toggleList({ type: 'unordered-list' });
        }

        return next();
    };

    return [
        ...lists,
        {
            queries: { isList },
            renderBlock: (props: RenderBlockProps, editor: CoreEditor, next: () => any) => lists[0].renderNode(props, editor, next),
            onKeyDown,
            sidebarButtons: [OrderedListToolbarButton, UnorderedListToolbarButton],
            serializers: [listItemDesializer, listDesializer],
        },
    ];
};


const UnorderedListToolbarButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ (props.editor as any).isList('unordered-list') } icon={ listBulletIcon } onClick={ () => (props.editor as any).toggleList({ type: 'unordered-list' }) } />;
};

const OrderedListToolbarButton = (props: { editor: any }) => {
    return <ToolbarButton isActive={ (props.editor as any).isList('ordered-list') } icon={ listNumberIcon } onClick={ () => (props.editor as any).toggleList({ type: 'ordered-list' }) } />;
};

const LIST_TAGS: any = {
    ul: 'unordered-list',
    ol: 'ordered-list',
};

const listDesializer = getBlockDesirialiser(LIST_TAGS);

const listItemDesializer = (el: any, next: any) => {
    if (el.tagName.toLowerCase() === 'li') {
        let listNodes: any = [];
        let childNodes: any = [];
        el.childNodes.forEach((node: any) => {
            if (node.nodeName !== 'UL' && node.nodeName !== 'OL') {
                next([node]).map((el: any) => childNodes.push(el));
            } else {
                next([node]).map((el: any) => listNodes.push(el));
            }
        });

        return {
            object: 'block',
            type: 'list-item',
            nodes: [{
                object: 'block',
                type: 'list-item-child',
                nodes: childNodes,
            }].concat(listNodes),
        };
    }
};
