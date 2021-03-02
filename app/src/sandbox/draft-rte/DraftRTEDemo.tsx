import { FlexRow, Panel } from '@epam/loveship';
import React, { useState } from 'react';
import { RichTextEditor, ToolbarButton } from '../../../../draft-rte';
import * as css from './DraftRTEDemo.scss';

export const DraftRTEDemo = (props: any) => {
    const [value, setValue] = useState('');
    const rteButtonStructure: ToolbarButton[] = [
        'bold', 'italic', 'underline', 'header-dropdown', 'unordered-list', 'ordered-list', 'link', 'clear-format',
    ];

    return (
        <Panel
            style={{ display: 'flex', width: '100%', height: 'calc(100vh - 60px)' }}
            background='white'
        >
            <FlexRow>
                <RichTextEditor
                    valueType='html'
                    structure={rteButtonStructure}
                    value={value}
                    onValueChange={(newValue) => {
                        setValue(newValue);
                    }}
                    placeholder={props.isReadonly ? '' : 'Type your text'}
                    cx={css.DraftRTEDemo}
                />
            </FlexRow>
        </Panel>
    );
}
