export type TRef = {
    module?: string,
    name: string,
};

type TType = {
    kind: string;
    name: string;
    value: string;
    valuePrint: string[];
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    optional?: boolean;
    inheritedFrom?: TRef;
};
export type TPropsV2Response = Record<string, TType>;
