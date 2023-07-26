import { ListPlugin, withList } from '@udecode/plate-list';
import { PlateEditor, Value, WithPlatePlugin } from '@udecode/plate-common';

// TODO: move to plate
export const withOurList = <
    V extends Value = Value,
    E extends PlateEditor<V> = PlateEditor<V>
>(
    editor: E,
    options: WithPlatePlugin<ListPlugin, V, E>,
) => {
    const { deleteBackward, deleteFragment } = editor;

    editor = withList(editor, options);

    editor.deleteFragment = (direction) => {
        deleteFragment(direction);
    };

    editor.deleteBackward = (unit) => {
        deleteBackward(unit as any);
    };

    return editor;
};
