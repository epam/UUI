type TType = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    props?: TTypeProp[];
};
export type TTypeProp = {
    kind: string;
    name: string;
    value: string;
    comment?: string[];
    optional?: boolean;
    inheritedFrom?: string;
};

export type TPropsV2Response = Record<string, TType>;
