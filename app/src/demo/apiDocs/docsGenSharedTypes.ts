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

/**
 * This type contains minimum info required to build a link to the type
 * or to show a short summary.
 */
export type TTypeRef = {
    typeName: TTypeName,
    module?: string,
    src?: string;
};

/** Map moduleName to exportName */
export type TTypeRefShort = `${string}:${string}`;
export type TTypeRefMap = Record<TTypeRefShort, TTypeRef & { isPublic?: boolean }>;
export type TType = {
    kind: number;
    /**
     * A short ref is used here, which helps to reduce size of the JSON.
     * In this specific case the size is reduced when type references itself.
     * */
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
    /**
     * A short ref is used here, which helps to reduce size of the JSON
     * */
    from?: TTypeRefShort;
};

export type TPublicTypesByModule = {
    [moduleName: string]: {
        [exportName: string]: TType
    }
};
export type TApiReferenceJson = {
    /** Types which are exported from any UUI module */
    publicTypes: TPublicTypesByModule;
    /**
     * Map which contains references to both "public" types and "private" types.
     * Private types are presented only in this map: i.e. it's only possible to show a brief summary about this type,
     * with no possibility to see other details.
     * */
    refs: TTypeRefMap,
};
