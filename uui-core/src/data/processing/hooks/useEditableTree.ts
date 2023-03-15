import { useEffect, useState } from "react";
import { usePrevious } from "../../../../";
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

export const useEditableTree = <TItem, TId>(
    props: UseEditableTreeProps<TItem, TId>,
): IEditable<ITree<TItem, TId>> => {
    const [tree, setTree] = useState<ITree<TItem, TId>>();
    const prevProps = usePrevious(props);

    useEffect(() => {
        if (props !== prevProps) {
            let newTree;
            if (isTree(props)) {
                newTree = props;
            } else {
                newTree = Tree.create(props.params, props.items);
            }
            setTree(newTree);
        }
    }, [props]);

    return { value: tree, onValueChange: setTree };
};
