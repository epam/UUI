import { IDndActor } from './dnd';
import { Link } from './objects';
import { FlexRowProps, IEditable, IHasValidationMessage, IDisableable, ICanBeInvalid } from './props';

/** DataRowProps is a base shape of props, passed to items in various lists or trees.
 *
 * Despite 'Row' in it's name, it doesn't directly connected to a table.
 * We use DataRowProps as a base for DataTableRowProps and DataPickerRowProps.
 * But it can also be used for any user-built list, tree, custom picker rows, or even a grid of cards.
 *
 * Array of DataRowProps describes a part of hierarchical list, while still being a flat array (not a tree of some kind).
 * We use depth, indent, path, and other props to show row's place in the hierarchy.
 * This is very handy to handle rendering, especially in virtual scrolling scenarios.
 *
 * DataSources primary job is to convert various data stores into arrays of DataRowProps.
 */
export type DataRowProps<TItem, TId> = FlexRowProps &
DataRowOptions<TItem, TId> & {
    /** ID of the TItem rows displays */
    id: TId;

    /** Key to be used as component's key when rendering. Usually, it's stringified ID */
    rowKey: string;

    /** Index of the row, from the top of the list. This doesn't account any hierarchy. */
    index: number;

    /** The data item (TItem) row displays. Will be undefined if isLoading = true. */
    value: TItem | undefined;

    /** ID of the parent TItem */
    parentId?: TId;

    /** Hierarchical path from the root node to the item (excluding the item itself) */
    path?: DataRowPathItem<TId, TItem>[];

    /* visual */

    /** Depth of the row in tree, 0 for the top-level */
    depth?: number;

    /** Indent of the item, to show hierarchy.
         *  Unlike depth, it contains additional logic, to not add unnecessary indents:
         *  if all children of node has no children, all nodes would get the same indent as parent.
         */
    indent?: number;

    /** True if row is in loading state. 'value' is empty in this case */
    isLoading?: boolean;

    /** True if item doesn't exist in a dataSource */
    isUnknown?: boolean;

    /** True if row be folded or unfolded (usually because it contains children) */
    isFoldable?: boolean;

    /** True if row is currently folded */
    isFolded?: boolean;

    /** True if row is checked with checkbox */
    isChecked?: boolean;

    /** True if row has checkbox and can be checkable */
    isCheckable?: boolean;

    /** True if some of row's children are checked.
         * Used to show 'indefinite' checkbox state, to show user that something inside is checked */
    isChildrenChecked?: boolean;

    /** True if row is selected (in single-select mode, or in case when interface use both single row selection and checkboxes) */
    isSelected?: boolean;

    /** True if any of row's children is selected. */
    isChildrenSelected?: boolean;

    /** True if row is focused. Focus can be changed via keyboard arrow keys, or by hovering mouse on top of the row */
    isFocused?: boolean;

    /** True if row is the last child of his parent */
    isLastChild?: boolean;

    /* events */

    /** Handles row folding change.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onFold?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row click.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onClick?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row checkbox change.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onCheck?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row selection.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onSelect?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row focusing */
    onFocus?(focusedIndex: number): void;

    /** True if row pinned, it means that it will be sticky inside his nesting level */
    isPinned?: boolean;
};

/** Holds parent info for data rows */
export interface DataRowPathItem<TId, TItem> {
    /** Item ID */
    id: TId;
    /** Item value */
    value: TItem;
    /** If true, indicates that this item last child of his parent */
    isLastChild: boolean;
}

/** A part of the DataRowProps, which can be configured for each data row via getRowOptions callback.
 * Other props in DataRowProps are computed when generating rows.
 */
export interface DataRowOptions<TItem, TId> extends Partial<IEditable<TItem>>, IHasValidationMessage {
    /** If row needs a checkbox, this field should be specified, and it props can be configured here */
    checkbox?: { isVisible: boolean } & IDisableable & ICanBeInvalid;

    /** True if row is selectable (for whole-row single-selection, multi-selection via checkbox are configured with the checkbox prop) */
    isSelectable?: boolean;

    /** Configures row drag-n-drop options - if it can be dragged, can rows can be dropped into it, etc. */
    dnd?: IDndActor<any, any>;

    /** Row click handler */
    onClick?(rowProps: DataRowProps<TItem, TId>): void;

    /** Can be specified to make row act as a link (plain or SPA) */
    link?: Link;

    /**
     * A pure function that gets pinned state for each row.
     * If row pinned, it means that it will be sticky inside their parent section.
     * */
    pin?(rowProps: DataRowProps<TItem, TId>): boolean;
}
