export type TTypeName = {
    name: string;
    nameFull: string;
};
export type TTypeValue = {
    raw: string;
    print?: string[];
};
export type TTypeRef = {
    module?: string,
    typeName: TTypeName,
};
export type TType = {
    kind: string;
    typeName: TTypeName;
    typeValue: TTypeValue;
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    typeValue: TTypeValue;
    comment?: string[];
    required: boolean;
    from?: TTypeRef;
};
export type TPropsV2Response = Record<string, TType>;
