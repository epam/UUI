import isEqual from "lodash.isequal";
import { useCallback, useEffect, useState } from "react";
import { usePrevious } from "../../../..";
import { IEditable } from "../../../types";
import { ITree, Tree, TreeParams } from "../views";

interface TreeProps<TItem, TId> {
    params: TreeParams<TItem, TId>;
    items: TItem[] | ITree<TItem, TId>;
}

type UseEditableTreeProps<TItem, TId> = ITree<TItem, TId> | TreeProps<TItem, TId>;

const isTree = <TItem, TId>(props: UseEditableTreeProps<TItem, TId>): props is ITree<TItem, TId> => {
    return props instanceof Tree;
};

const arePropsEqual = <TItem, TId>(
    prevProps: UseEditableTreeProps<TItem, TId>,
    newProps: UseEditableTreeProps<TItem, TId>,
) => {
    if (prevProps instanceof Tree && newProps instanceof Tree) {
        return Tree.areEqual(prevProps, newProps);
    }

    if ('items' in prevProps && 'items' in newProps) {
        return isEqual(prevProps.items, newProps.items);
    }

    return isEqual(prevProps, newProps);
};

export const useTree = <TItem, TId>(
    props: UseEditableTreeProps<TItem, TId>,
): IEditable<ITree<TItem, TId>> => {
    const [tree, setTree] = useState<ITree<TItem, TId>>();
    const prevProps = usePrevious(props);

    useEffect(() => {
        if (!arePropsEqual(prevProps, props)) {
            let newTree;
            if (isTree(props)) {
                newTree = props;
            } else {
                newTree = Tree.create(props.params, props.items);
            }
            if (!Tree.areEqual(newTree, tree)) {
                setTree(newTree);
            }
        }
    }, [props]);

    const onValueChange = useCallback((newTree: ITree<TItem, TId>) => {
        if (!Tree.areEqual(newTree, tree)) {
            setTree(newTree);
        }
    }, [tree, setTree]);

    return { value: tree, onValueChange };
};
