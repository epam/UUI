import { usePlateEditorRef, collapseSelection } from '@udecode/plate-common';
import { useTableStore } from '@udecode/plate-table';
import { useSelectedCells } from './useSelectedCells';

export const useTableElement = () => {
    const editor = usePlateEditorRef();
    const selectedCells = useTableStore().get.selectedCells();

    useSelectedCells();

    return {
        props: {
            onMouseDown: () => {
                // until cell dnd is supported, we collapse the selection on mouse down
                if (selectedCells) {
                    collapseSelection(editor);
                }
            },
        },
        colGroupProps: {
            contentEditable: false,
            style: { width: '100%' },
        },
    };
};
