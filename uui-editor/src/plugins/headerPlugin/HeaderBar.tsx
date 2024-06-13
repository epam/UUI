import * as React from 'react';
import { PlateEditor, getBlockAbove, getPluginOptions, setElements, useEditorRef } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { FlexRow } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';

import css from './HeaderBar.module.scss';
import { PARAGRAPH_TYPE } from '../paragraphPlugin';
import { HEADER_MAP, HEADER_PLUGIN_KEY } from './constants';
import { HeaderPluginOptions } from './types';

interface HeaderBarProps extends DropdownBodyProps {
    editor: PlateEditor;
}

export function HeaderBar(props: HeaderBarProps) {
    const editorRef = useEditorRef();
    const { headers } = React.useMemo(() => getPluginOptions<HeaderPluginOptions>(
        editorRef,
        HEADER_PLUGIN_KEY,
    ), [editorRef]);

    const toggleBlock = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, blockType: string) => {
        event.preventDefault();
        const block = getBlockAbove(props.editor);

        if (block?.length && block[0].type === blockType) {
            setElements(props.editor, {
                data: {},
                type: PARAGRAPH_TYPE,
                children: [{ text: '' }],
            });
        } else {
            setElements(props.editor, { type: blockType });
        }
    };

    const clearHeaderStyle = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setElements(props.editor, {
            data: {},
            type: PARAGRAPH_TYPE,
            children: [{ text: '' }],
        });
    };

    const block = getBlockAbove(props.editor);
    return (
        <FlexRow cx={ css.wrapper }>
            <ToolbarButton
                onClick={ (event) => clearHeaderStyle(event) }
                icon={ ClearIcon }
            />
            {headers.map((type) => {
                return (
                    <ToolbarButton
                        key={ type }
                        cx={ css.button }
                        onClick={ (event) => toggleBlock(event, type) }
                        isActive={ block?.length && block[0].type === type }
                        icon={ () => {
                            return (
                                <span className={ css.icon }>{HEADER_MAP[type as keyof typeof HEADER_MAP]}</span>
                            );
                        } }
                    />
                );
            })}
        </FlexRow>
    );
}
