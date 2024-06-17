import * as React from 'react';
import { PlateEditor, getBlockAbove, getPluginOptions, setElements, useEditorRef } from '@udecode/plate-common';
import { DropdownBodyProps } from '@epam/uui-core';
import { Dropdown, FlexRow } from '@epam/uui';
import { ToolbarButton } from '../../implementation/ToolbarButton';

import { ReactComponent as ClearIcon } from '../../icons/text-color-default.svg';
import { ReactComponent as HeadlinePickerIcon } from '../../icons/heading.svg';

import css from './HeaderBar.module.scss';
import { PARAGRAPH_TYPE } from '../paragraphPlugin';
import { HeaderPluginOptions } from './types';
import { useIsPluginActive } from '../../helpers';
import { HEADER_PLUGIN_KEY, HEADER_TO_TYPE, HEADER_TYPE_TO_ICON } from './constants';

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
            {headers.map((header) => {
                const type = HEADER_TO_TYPE[header];
                return (
                    <ToolbarButton
                        key={ type }
                        cx={ css.button }
                        onClick={ (event) => toggleBlock(event, type) }
                        isActive={ block?.length && block[0].type === type }
                        icon={ HEADER_TYPE_TO_ICON[type as keyof typeof HEADER_TYPE_TO_ICON] }
                    />
                );
            })}
        </FlexRow>
    );
}

interface IToolbarButton {
    editor: PlateEditor;
}

export function HeaderButton({ editor }: IToolbarButton): any {
    if (!useIsPluginActive(HEADER_PLUGIN_KEY)) return null;

    return (
        <Dropdown
            renderTarget={ (props) => (
                <ToolbarButton
                    icon={ HeadlinePickerIcon }
                    { ...props }
                />
            ) }
            renderBody={ (props) => <HeaderBar editor={ editor } { ...props } /> }
            placement="top-start"
            modifiers={ [{
                name: 'offset',
                options: { offset: [0, 3] },
            }] }
        />
    );
}
