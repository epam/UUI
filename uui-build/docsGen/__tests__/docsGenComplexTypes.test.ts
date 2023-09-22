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
            '@epam/test-module': {
                TPrimitives: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'pAny',
                            required: true,
                            typeValue: {
                                raw: 'any',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pArray',
                            required: true,
                            typeValue: {
                                raw: 'string[]',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBigint',
                            required: true,
                            typeValue: {
                                raw: 'bigint',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBool',
                            required: true,
                            typeValue: {
                                raw: 'false | true',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pLiteral',
                            required: true,
                            typeValue: {
                                raw: "'test'",
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNever',
                            required: true,
                            typeValue: {
                                raw: 'never',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNull',
                            required: true,
                            typeValue: {
                                raw: 'null',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNumber',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pObject',
                            required: true,
                            typeValue: {
                                raw: 'object',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pString',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pSymbol',
                            required: true,
                            typeValue: {
                                raw: 'symbol',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pTuple',
                            required: true,
                            typeValue: {
                                raw: "[boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test']",
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUndefined',
                            required: true,
                            typeValue: {
                                raw: 'undefined',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnion',
                            required: false,
                            typeValue: {
                                raw: 'undefined | null | string | number | bigint | false | true | symbol | void | object | string[]',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnknown',
                            required: true,
                            typeValue: {
                                raw: 'unknown',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pVoid',
                            required: true,
                            typeValue: {
                                raw: 'void',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TPrimitives',
                            nameFull: 'TPrimitives',
                        },
                    },
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
            '@epam/test-module': {
                ITestA: {
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'ITestB',
                                    nameFull: 'ITestB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'a',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'aProp',
                            required: true,
                            typeValue: {
                                raw: "'black' | 'white'",
                            },
                        },
                        {
                            comment: [
                                'This is inherited property TSDoc',
                            ],
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'ITestB',
                                    nameFull: 'ITestB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'b',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            comment: [
                                'This is GetAccessor',
                            ],
                            kind: 'GetAccessor',
                            name: 'get someBool',
                            required: true,
                            typeValue: {
                                raw: 'get someBool(): boolean',
                            },
                        },
                        {
                            comment: [
                                'This is MethodDeclaration',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodDeclarationTest',
                            required: true,
                            typeValue: {
                                raw: '(p: number) => number',
                            },
                        },
                        {
                            comment: [
                                'This is MethodSignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodSignatureTest',
                            required: true,
                            typeValue: {
                                raw: '(a?: number | undefined, b?: number | undefined) => number | undefined',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'propExternalTypeTest',
                            required: true,
                            typeValue: {
                                raw: 'HTMLElement',
                            },
                        },
                        {
                            comment: [
                                'This is PropertySignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'propSignatureTest',
                            required: true,
                            typeValue: {
                                raw: '{ name: string; value: any; }[]',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'unionPropTest',
                            required: true,
                            typeValue: {
                                raw: 'TUnionTest',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'ITestA',
                            nameFull: 'ITestA',
                        },
                    },
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
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'a',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            comment: [
                                'This is inherited property TSDoc',
                            ],
                            kind: 'PropertySignature',
                            name: 'b',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'ITestB',
                            nameFull: 'ITestB',
                        },
                    },
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
        };
        expect(generateDocs(input)).toEqual(output);
    });

    test('should not expand props from external type', () => {
        const input = 'export type TExternalTypeTest = HTMLElement;';
        const output = {
            '@epam/test-module': {
                TExternalTypeTest: {
                    kind: 'TypeAliasDeclaration',
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TExternalTypeTest',
                            nameFull: 'TExternalTypeTest',
                        },
                    },
                    typeValue: {
                        print: [
                            'type TExternalTypeTest = HTMLElement;',
                        ],
                        raw: 'HTMLElement',
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
            '@epam/test-module': {
                TTest: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'TLocal',
                                    nameFull: 'TLocal',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'p2',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TTest',
                            nameFull: 'TTest',
                        },
                    },
                    typeValue: {
                        print: [
                            "type TTest = Omit<TLocal, 'p1'>;",
                        ],
                        raw: 'TTest',
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
            '@epam/test-module': {
                IA: {
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'p1',
                            required: true,
                            typeValue: {
                                raw: 'Record<string, T>',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'IA',
                            nameFull: 'IA<T>',
                        },
                    },
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
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'p1',
                            required: true,
                            typeValue: {
                                raw: 'Record<string, S>',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'TA',
                            nameFull: 'TA<S>',
                        },
                    },
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
            '@epam/test-module': {
                AcceptDropParams: {
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'dstData',
                            required: false,
                            typeValue: {
                                raw: 'undefined | TDstData',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'offsetLeft',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'offsetTop',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'srcData',
                            required: true,
                            typeValue: {
                                raw: 'TSrcData',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'targetHeight',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'targetWidth',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'AcceptDropParams',
                            nameFull: 'AcceptDropParams<TSrcData, TDstData>',
                        },
                    },
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
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
