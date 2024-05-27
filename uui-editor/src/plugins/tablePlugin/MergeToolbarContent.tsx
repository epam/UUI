import React from 'react';

import { ReactComponent as TableMerge } from '../../icons/table-merge.svg';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import { collapseSelection, useEditorRef } from '@udecode/plate-common';
import { mergeTableCells } from '@udecode/plate-table';

export function MergeToolbarContent() {
    const editor = useEditorRef();

    return (
        <ToolbarButton
            onClick={ () => {
                mergeTableCells(editor);
                collapseSelection(editor);
            } }
            icon={ TableMerge }
        />
    );
}
