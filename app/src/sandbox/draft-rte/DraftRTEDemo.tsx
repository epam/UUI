import { FlexRow, Panel } from '@epam/loveship';
import React, { useState } from 'react';
import { RichTextEditor, ToolbarButton } from '@epam/draft-rte';
import css from './DraftRTEDemo.module.scss';

export function DraftRTEDemo(props: any) {
    const [value, setValue] = useState('');
    const rteButtonStructure: ToolbarButton[] = ['bold', 'italic', 'underline', 'header-dropdown', 'unordered-list', 'ordered-list', 'link', 'clear-format'];

    return (
        <Panel cx={ [css.demoWrapper, css.uuiThemeLoveship] } background="white">
            <FlexRow>
                <RichTextEditor
                    valueType="html"
                    structure={ rteButtonStructure }
                    value={ value }
                    onValueChange={ (newValue) => {
                        setValue(newValue);
                    } }
                    placeholder={ props.isReadonly ? '' : 'Type your text' }
                    cx={ css.DraftRTEDemo }
                />
            </FlexRow>
        </Panel>
    );
}
