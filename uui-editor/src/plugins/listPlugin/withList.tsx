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
    const { setSelection } = editor;

    editor = withList(editor, options);

    // temporary fix for last elements remove
    // it cancels selection change in deleteMerge call from deleteFragmentList function
    editor.setSelection = (props) => {
        const focus = props.focus;
        if (focus && focus.path[0] === 0 && focus.path[1] === 0) {
            return;
        }
        setSelection(props);
    };

    return editor;
};
