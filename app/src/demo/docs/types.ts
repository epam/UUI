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
    inheritedFrom?: {
        module?: string,
        name: string,
    };
};

export type TPropsV2Response = Record<string, TType>;
