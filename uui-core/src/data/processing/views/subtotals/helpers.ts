import { Subtotals } from "./types";

export const isSubtotalRecord = <TItem extends {}, TSubtotals, TId>(
    record: TItem | Subtotals<TSubtotals, TId>,
): record is Subtotals<TSubtotals, TId> => {
    return 'isSubtotal' in record && record.isSubtotal;
};

export const createSubtotalRecord = <TSubtotals extends {}, TId>(id: TId, record: TSubtotals): Subtotals<TSubtotals, TId> => ({
    ...record,
    id: `subtotal-${ id }`,
    parentId: id,
    isSubtotal: true,
});
