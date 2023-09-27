import { generateDocs } from './utils/test-utils';

describe('docsGen:complexTypes', () => {
    test('should convert object type with different types of props', () => {
        const input = `
            export type TPrimitives = {
                pBool: boolean;
                pNumber: number;
                pString: string;
                pAny: any;
                pUnknown: unknown;
                pNever: never;
                pVoid: void;
                pNull: null;
                pUndefined: undefined;
                pArray: string[];
                pObject: object;
                pBigint: bigint;
                pSymbol: symbol;
                pLiteral: 'test'
                pTuple: [boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test'];
                pUnion: boolean | number | string | never | void | null | undefined | string[] | object | bigint | symbol | 'test';
            }
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TPrimitives: {
                        kind: 264,
                        props: [
                            {
                                name: 'pBool',
                                required: true,
                                typeValue: {
                                    raw: 'false | true',
                                },
                                uid: 1,
                            },
                            {
                                name: 'pNumber',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 2,
                            },
                            {
                                name: 'pString',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 3,
                            },
                            {
                                name: 'pAny',
                                required: true,
                                typeValue: {
                                    raw: 'any',
                                },
                                uid: 4,
                            },
                            {
                                name: 'pUnknown',
                                required: true,
                                typeValue: {
                                    raw: 'unknown',
                                },
                                uid: 5,
                            },
                            {
                                name: 'pNever',
                                required: true,
                                typeValue: {
                                    raw: 'never',
                                },
                                uid: 6,
                            },
                            {
                                name: 'pVoid',
                                required: true,
                                typeValue: {
                                    raw: 'void',
                                },
                                uid: 7,
                            },
                            {
                                name: 'pNull',
                                required: true,
                                typeValue: {
                                    raw: 'null',
                                },
                                uid: 8,
                            },
                            {
                                name: 'pUndefined',
                                required: true,
                                typeValue: {
                                    raw: 'undefined',
                                },
                                uid: 9,
                            },
                            {
                                name: 'pArray',
                                required: true,
                                typeValue: {
                                    raw: 'string[]',
                                },
                                uid: 10,
                            },
                            {
                                name: 'pObject',
                                required: true,
                                typeValue: {
                                    raw: 'object',
                                },
                                uid: 11,
                            },
                            {
                                name: 'pBigint',
                                required: true,
                                typeValue: {
                                    raw: 'bigint',
                                },
                                uid: 12,
                            },
                            {
                                name: 'pSymbol',
                                required: true,
                                typeValue: {
                                    raw: 'symbol',
                                },
                                uid: 13,
                            },
                            {
                                name: 'pLiteral',
                                required: true,
                                typeValue: {
                                    raw: "'test'",
                                },
                                uid: 14,
                            },
                            {
                                name: 'pTuple',
                                required: true,
                                typeValue: {
                                    raw: "[boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test']",
                                },
                                uid: 15,
                            },
                            {
                                name: 'pUnion',
                                required: false,
                                typeValue: {
                                    raw: 'undefined | null | string | number | bigint | false | true | symbol | void | object | string[]',
                                },
                                uid: 16,
                            },
                        ],
                        typeRef: 'test/test.tsx:TPrimitives',
                        typeValue: {
                            print: [
                                'type TPrimitives = {',
                                '    pBool: boolean;',
                                '    pNumber: number;',
                                '    pString: string;',
                                '    pAny: any;',
                                '    pUnknown: unknown;',
                                '    pNever: never;',
                                '    pVoid: void;',
                                '    pNull: null;',
                                '    pUndefined: undefined;',
                                '    pArray: string[];',
                                '    pObject: object;',
                                '    pBigint: bigint;',
                                '    pSymbol: symbol;',
                                "    pLiteral: 'test';",
                                '    pTuple: [',
                                '        boolean,',
                                '        number,',
                                '        string,',
                                '        any,',
                                '        unknown,',
                                '        never,',
                                '        void,',
                                '        null,',
                                '        undefined,',
                                '        string[],',
                                '        object,',
                                '        bigint,',
                                '        symbol,',
                                "        'test'",
                                '    ];',
                                "    pUnion: boolean | number | string | never | void | null | undefined | string[] | object | bigint | symbol | 'test';",
                                '};',
                            ],
                            raw: 'TPrimitives',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:TPrimitives': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TPrimitives',
                        nameFull: 'TPrimitives',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should convert interface which extends other interface', () => {
        const input = `
            export interface ITestB {
                a: number;
                /** This is inherited property TSDoc */
                b: number;
            }
            export interface ITestA extends ITestB {
                // This comment must be ignored, because it's not TSDoc
                aProp: 'black' | 'white';

                propExternalTypeTest: HTMLElement;

                unionPropTest: TUnionTest;

                /** This is PropertySignature */
                propSignatureTest: { name: string; value: any }[];

                /** This is MethodSignature */
                methodSignatureTest: (a?: number, b?: number) => number | undefined;

                /** This is MethodDeclaration */
                methodDeclarationTest: (p: number) => number;

                /** This is GetAccessor */
                get someBool(): boolean;

                /** This is SetAccessor */
                set someBool(b: boolean);
            }
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    ITestA: {
                        kind: 263,
                        props: [
                            {
                                name: 'aProp',
                                required: true,
                                typeValue: {
                                    raw: "'black' | 'white'",
                                },
                                uid: 1,
                            },
                            {
                                name: 'propExternalTypeTest',
                                required: true,
                                typeValue: {
                                    raw: 'HTMLElement',
                                },
                                uid: 2,
                            },
                            {
                                name: 'unionPropTest',
                                required: true,
                                typeValue: {
                                    raw: 'TUnionTest',
                                },
                                uid: 3,
                            },
                            {
                                comment: [
                                    'This is PropertySignature',
                                ],
                                name: 'propSignatureTest',
                                required: true,
                                typeValue: {
                                    raw: '{ name: string; value: any; }[]',
                                },
                                uid: 4,
                            },
                            {
                                comment: [
                                    'This is MethodSignature',
                                ],
                                name: 'methodSignatureTest',
                                required: true,
                                typeValue: {
                                    raw: '(a?: number | undefined, b?: number | undefined) => number | undefined',
                                },
                                uid: 5,
                            },
                            {
                                comment: [
                                    'This is MethodDeclaration',
                                ],
                                name: 'methodDeclarationTest',
                                required: true,
                                typeValue: {
                                    raw: '(p: number) => number',
                                },
                                uid: 6,
                            },
                            {
                                comment: [
                                    'This is GetAccessor',
                                ],
                                name: 'get someBool',
                                required: true,
                                typeValue: {
                                    raw: 'get someBool(): boolean',
                                },
                                uid: 7,
                            },
                            {
                                from: 'test/test.tsx:ITestB',
                                name: 'a',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 8,
                            },
                            {
                                comment: [
                                    'This is inherited property TSDoc',
                                ],
                                from: 'test/test.tsx:ITestB',
                                name: 'b',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 9,
                            },
                        ],
                        typeRef: 'test/test.tsx:ITestA',
                        typeValue: {
                            print: [
                                'interface ITestA extends ITestB {',
                                "    // This comment must be ignored, because it's not TSDoc",
                                "    aProp: 'black' | 'white';",
                                '    propExternalTypeTest: HTMLElement;',
                                '    unionPropTest: TUnionTest;',
                                '    /** This is PropertySignature */',
                                '    propSignatureTest: {',
                                '        name: string;',
                                '        value: any;',
                                '    }[];',
                                '    /** This is MethodSignature */',
                                '    methodSignatureTest: (a?: number, b?: number) => number | undefined;',
                                '    /** This is MethodDeclaration */',
                                '    methodDeclarationTest: (p: number) => number;',
                                '    /** This is GetAccessor */',
                                '    get someBool(): boolean;',
                                '    /** This is SetAccessor */',
                                '    set someBool(b: boolean);',
                                '}',
                            ],
                            raw: 'ITestA',
                        },
                    },
                    ITestB: {
                        kind: 263,
                        props: [
                            {
                                name: 'a',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 1,
                            },
                            {
                                comment: [
                                    'This is inherited property TSDoc',
                                ],
                                name: 'b',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 2,
                            },
                        ],
                        typeRef: 'test/test.tsx:ITestB',
                        typeValue: {
                            print: [
                                'interface ITestB {',
                                '    a: number;',
                                '    /** This is inherited property TSDoc */',
                                '    b: number;',
                                '}',
                            ],
                            raw: 'ITestB',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:ITestA': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'ITestA',
                        nameFull: 'ITestA',
                    },
                },
                'test/test.tsx:ITestB': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'ITestB',
                        nameFull: 'ITestB',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should not expand props from external type', () => {
        const input = 'export type TExternalTypeTest = HTMLElement;';
        const output = {
            byModule: {
                '@epam/test-module': {
                    TExternalTypeTest: {
                        kind: 264,
                        typeRef: 'test/test.tsx:TExternalTypeTest',
                        typeValue: {
                            print: [
                                'type TExternalTypeTest = HTMLElement;',
                            ],
                            raw: 'HTMLElement',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:TExternalTypeTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TExternalTypeTest',
                        nameFull: 'TExternalTypeTest',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should expand props if internal type is wrapped in Typescript utility type', () => {
        const input = `
            type TLocal = {
                p1: number;
                p2: string;
            }
            export type TTest = Omit<TLocal, 'p1'>;
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    TTest: {
                        kind: 264,
                        props: [
                            {
                                from: 'test/test.tsx:TLocal',
                                name: 'p2',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 1,
                            },
                        ],
                        typeRef: 'test/test.tsx:TTest',
                        typeValue: {
                            print: [
                                "type TTest = Omit<TLocal, 'p1'>;",
                            ],
                            raw: 'TTest',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:TLocal': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TLocal',
                        nameFull: 'TLocal',
                    },
                },
                'test/test.tsx:TTest': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TTest',
                        nameFull: 'TTest',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should include generic type argument names in fullName of type', () => {
        const input = `
            export interface IA<T> {
                p1: Record<string, T>;
            }
            export type TA<S> = {
                p1: Record<string, S>;
            }
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    IA: {
                        kind: 263,
                        props: [
                            {
                                name: 'p1',
                                required: true,
                                typeValue: {
                                    raw: 'Record<string, T>',
                                },
                                uid: 1,
                            },
                        ],
                        typeRef: 'test/test.tsx:IA',
                        typeValue: {
                            print: [
                                'interface IA<T> {',
                                '    p1: Record<string, T>;',
                                '}',
                            ],
                            raw: 'IA<T>',
                        },
                    },
                    TA: {
                        kind: 264,
                        props: [
                            {
                                name: 'p1',
                                required: true,
                                typeValue: {
                                    raw: 'Record<string, S>',
                                },
                                uid: 1,
                            },
                        ],
                        typeRef: 'test/test.tsx:TA',
                        typeValue: {
                            print: [
                                'type TA<S> = {',
                                '    p1: Record<string, S>;',
                                '};',
                            ],
                            raw: 'TA<S>',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:IA': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IA',
                        nameFull: 'IA<T>',
                    },
                },
                'test/test.tsx:TA': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'TA',
                        nameFull: 'TA<S>',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should convert interface with generics', () => {
        const input = `
        export interface AcceptDropParams<TSrcData, TDstData> {
            srcData: TSrcData;
            dstData?: TDstData;
            offsetLeft: number;
            offsetTop: number;
            targetWidth: number;
            targetHeight: number;
        }
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    AcceptDropParams: {
                        kind: 263,
                        props: [
                            {
                                name: 'srcData',
                                required: true,
                                typeValue: {
                                    raw: 'TSrcData',
                                },
                                uid: 1,
                            },
                            {
                                name: 'dstData',
                                required: false,
                                typeValue: {
                                    raw: 'undefined | TDstData',
                                },
                                uid: 2,
                            },
                            {
                                name: 'offsetLeft',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 3,
                            },
                            {
                                name: 'offsetTop',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 4,
                            },
                            {
                                name: 'targetWidth',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 5,
                            },
                            {
                                name: 'targetHeight',
                                required: true,
                                typeValue: {
                                    raw: 'number',
                                },
                                uid: 6,
                            },
                        ],
                        typeRef: 'test/test.tsx:AcceptDropParams',
                        typeValue: {
                            print: [
                                'interface AcceptDropParams<TSrcData, TDstData> {',
                                '    srcData: TSrcData;',
                                '    dstData?: TDstData;',
                                '    offsetLeft: number;',
                                '    offsetTop: number;',
                                '    targetWidth: number;',
                                '    targetHeight: number;',
                                '}',
                            ],
                            raw: 'AcceptDropParams<TSrcData, TDstData>',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:AcceptDropParams': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'AcceptDropParams',
                        nameFull: 'AcceptDropParams<TSrcData, TDstData>',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should convert interface when it extends another interface and passes specific generic parameter to it', () => {
        const input = `
            interface IBaseInterface<T> {
                value: T;
                onValueChange(newValue: T): void;
            }            
            export interface IInterface extends IBaseInterface<string> {};
        `;
        const output = {
            byModule: {
                '@epam/test-module': {
                    IInterface: {
                        kind: 263,
                        props: [
                            {
                                from: 'test/test.tsx:IBaseInterface',
                                name: 'value',
                                required: true,
                                typeValue: {
                                    raw: 'string',
                                },
                                uid: 1,
                            },
                            {
                                from: 'test/test.tsx:IBaseInterface',
                                name: 'onValueChange',
                                required: true,
                                typeValue: {
                                    raw: '(newValue: string) => void',
                                },
                                uid: 2,
                            },
                        ],
                        typeRef: 'test/test.tsx:IInterface',
                        typeValue: {
                            print: [
                                'interface IInterface extends IBaseInterface<string> {',
                                '}',
                            ],
                            raw: 'IInterface',
                        },
                    },
                },
            },
            references: {
                'test/test.tsx:IBaseInterface': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IBaseInterface',
                        nameFull: 'IBaseInterface<T>',
                    },
                },
                'test/test.tsx:IInterface': {
                    external: true,
                    module: 'test/test.tsx',
                    src: 'test/test.tsx',
                    typeName: {
                        name: 'IInterface',
                        nameFull: 'IInterface',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
