/**
 * NOTE: Types in this file are shared with front-end and must be copied to "@epam/app" as-is
 */
//

export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
/** Map moduleName to exportName */
export type TTypeRef = `${string}:${string}`;
/**
 * This type contains minimum info required to build a link to the type
 * or to show a short summary.
 */
export type TTypeSummary = {
    typeName: TTypeName;
    module: string;
    exported: boolean;
    src?: string;
    comment?: string[];
};
export type TTypeDetails = {
    kind: number;
    typeValue: TTypeValue;
    propsFromUnion?: boolean;
    props?: TTypeProp[];
};
export type TTypeProp = {
    uid: number;
    name: string;
    typeValue: TTypeValue;
    required: boolean;
    comment?: string[];
    from?: TTypeRef;
};
export type TType = {
    summary: TTypeSummary,
    details?: TTypeDetails;
};
