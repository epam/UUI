import { TTypeProp, TTypeRef, TTypeSummary } from '@epam/uui-docs';

export type TDocsGenTypeSummary = Record<TTypeRef, TTypeSummary>;

export type TTypeGroup = { _group: true, from: TTypeProp['from'], comment: TTypeProp['comment'] };
export type TApiRefPropsItem = TTypeProp | TTypeGroup;

export function isApiRefPropGroup(item: TTypeProp | TTypeGroup): item is TTypeGroup {
    return (item as TTypeGroup)._group;
}
