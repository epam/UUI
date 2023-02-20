import Lists from '@convertkit/slate-lists';
import { Editor as CoreEditor, Editor } from 'slate';
import { RenderBlockProps } from 'slate-react';
import { ReactComponent as ListBulletIcon } from '../../icons/bullet-list.svg';
import { ReactComponent as ListNumberIcon } from '../../icons/numbered-list.svg';
import * as React from 'react';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { getBlockDesirialiser } from '../../helpers';

export const listPlugin = () => {
    const lists = Lists({
        blocks: {
            ordered_list: 'ordered-list',
            unordered_list: 'unordered-list',
            list_item: 'list-item',
        },
    });

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
    const onClick = () => {
        (props.editor as any).toggleList({ type: 'unordered-list' });
    };
    return <ToolbarButton isActive={(props.editor as any).isList('unordered-list')} icon={ListBulletIcon} onClick={onClick} />;
};

const OrderedListToolbarButton = (props: { editor: any }) => {
    return (
        <ToolbarButton
            isActive={(props.editor as any).isList('ordered-list')}
            icon={ListNumberIcon}
            onClick={() => (props.editor as any).toggleList({ type: 'ordered-list' })}
        />
    );
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
            nodes: [
                {
                    object: 'block',
                    type: 'list-item-child',
                    nodes: childNodes,
                },
            ].concat(listNodes),
        };
    }
};
