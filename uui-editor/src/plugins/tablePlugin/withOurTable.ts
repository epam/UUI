import { PlateEditor, WithPlatePlugin, Value } from "@udecode/plate-common";
import { serializeHtml } from "@udecode/plate-serializer-html";
import {
    TablePlugin,
    getTableGridAbove,
    TTableElement,
    TTableRowElement,
    TTableCellElement,
    withTable,
} from "@udecode/plate-table";

const wiOurSetFragmentDataTable = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    plugin: WithPlatePlugin<TablePlugin<V>, V, E>,
    originSetFragment: any
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
            const newData = originSetFragment?.(data) as unknown as
                | DataTransfer
                | undefined;

            if (!newData) setFragmentData(data, originEvent);

            const plainData = data.getData("text/plain");
            newData.setData("text/csv", plainData);
            newData.setData("text/tsv", plainData);
            newData.setData("text/plain", plainData);

            let plateTable = null;
            try {
                const slateFragment = data.getData(
                    "application/x-slate-fragment"
                );
                const [tableNode]: [TTableElement] = JSON.parse(
                    decodeURIComponent(window.atob(slateFragment))
                );
                plateTable = tableNode;
            } catch (e) {}

            if (plateTable?.type === "table") {
                const rowElem = plateTable.children?.[0] as TTableRowElement;
                const cellElem = rowElem.children?.[0] as TTableCellElement;

                const serialized = serializeHtml(editor, {
                    nodes: cellElem.children as any,
                });
                newData.setData("text/html", serialized);

                // set slate fragment
                const selectedFragmentStr = JSON.stringify(cellElem.children);
                const encodedFragment = window.btoa(
                    encodeURIComponent(selectedFragmentStr)
                );
                newData.setData(
                    "application/x-slate-fragment",
                    encodedFragment
                );
            }

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
    // lines order is important
    const originSetFragment = editor.setFragmentData;
    editor = withTable(editor, plugin);
    editor = wiOurSetFragmentDataTable(editor, plugin, originSetFragment);

    return editor;
};
