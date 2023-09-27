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
export type TTypeRef = {
    typeName: TTypeName,
    module?: string,
    src?: string;
    external?: boolean;
};

export type TTypeRefShort = `${string}:${string}`;
export type TTypeRefMap = {
    [key: TTypeRefShort]: TTypeRef
};
export type TType = {
    kind: number;
    typeRef: TTypeRefShort;
    typeValue: TTypeValue;
    comment?: string[];
    propsFromUnion?: boolean;
    props?: TTypeProp[];
};
export type TTypeProp = {
    uid: number;
    name: string;
    typeValue: TTypeValue;
    comment?: string[];
    required: boolean;
    from?: TTypeRefShort;
};

export type TFormattedExportsMap = Record<string, TType>;
export type TFormattedExportsByModule = Record<string, TFormattedExportsMap>;

export type TResultJson = {
    byModule: TFormattedExportsByModule,
    references: TTypeRefMap
};
