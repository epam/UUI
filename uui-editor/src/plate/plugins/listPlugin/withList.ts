import {
    ListPlugin,
    PlateEditor,
    Value,
    WithPlatePlugin,
    withList,
} from "@udecode/plate";
import { deleteFragmentList } from "./deleteFragmentList";

export const withOurList = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    options: WithPlatePlugin<ListPlugin, V, E>
) => {
    const { deleteFragment } = editor;

    editor = withList(editor, options);

    editor.deleteFragment = (direction) => {
        if (deleteFragmentList(editor)) return;

        deleteFragment(direction);
    };

    return editor;
};
