import {
    PlateEditor,
    TablePlugin,
    WithPlatePlugin,
    withTable,
    Value,
    getTableGridAbove,
    serializeHtml,
} from "@udecode/plate";

const wiOurSetFragmentDataTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    const { setFragmentData } = editor;

    /**
     * Overrides behavior for single cell copy | cut operation.
     * TODO: move to plate
     */
    editor.setFragmentData = (
        data: DataTransfer,
        originEvent?: "drag" | "copy" | "cut" | undefined
    ) => {
        const tableEntry = getTableGridAbove(editor, { format: "table" })?.[0];
        const selectedCellEntries = getTableGridAbove(editor, {
            format: "cell",
        });
        const initialSelection = editor.selection;
        const CELLS_NUMBER = 1;

        if (
            tableEntry &&
            initialSelection &&
            selectedCellEntries.length === CELLS_NUMBER &&
            (originEvent === "copy" || originEvent === "cut")
        ) {
            const [[selectedCellNode, cellPath]] = selectedCellEntries;
            const cellContents = selectedCellNode.children;

            const plainText = data.getData("text/plain");
            data.setData("text/csv", plainText);
            data.setData("text/tsv", plainText);
            data.setData("text/plain", plainText);

            const serialized = serializeHtml(editor, {
                nodes: cellContents as any,
            });
            data.setData("text/html", serialized);

            // set slate fragment
            const selectedFragmentStr = JSON.stringify(cellContents);
            const encodedFragment = window.btoa(
                encodeURIComponent(selectedFragmentStr)
            );
            data.setData("application/x-slate-fragment", encodedFragment);

            return;
        }

        setFragmentData(data, originEvent);
    };

    return editor;
};

export const withOurTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>
) => {
    editor = withTable(editor, plugin);
    editor = wiOurSetFragmentDataTable(editor, plugin);

    return editor;
};
