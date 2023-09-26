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
                            uniqueId: '4',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pArray',
                            required: true,
                            typeValue: {
                                raw: 'string[]',
                            },
                            uniqueId: '10',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBigint',
                            required: true,
                            typeValue: {
                                raw: 'bigint',
                            },
                            uniqueId: '12',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBool',
                            required: true,
                            typeValue: {
                                raw: 'false | true',
                            },
                            uniqueId: '1',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pLiteral',
                            required: true,
                            typeValue: {
                                raw: "'test'",
                            },
                            uniqueId: '14',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNever',
                            required: true,
                            typeValue: {
                                raw: 'never',
                            },
                            uniqueId: '6',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNull',
                            required: true,
                            typeValue: {
                                raw: 'null',
                            },
                            uniqueId: '8',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNumber',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '2',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pObject',
                            required: true,
                            typeValue: {
                                raw: 'object',
                            },
                            uniqueId: '11',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pString',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '3',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pSymbol',
                            required: true,
                            typeValue: {
                                raw: 'symbol',
                            },
                            uniqueId: '13',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pTuple',
                            required: true,
                            typeValue: {
                                raw: "[boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test']",
                            },
                            uniqueId: '15',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUndefined',
                            required: true,
                            typeValue: {
                                raw: 'undefined',
                            },
                            uniqueId: '9',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnion',
                            required: false,
                            typeValue: {
                                raw: 'undefined | null | string | number | bigint | false | true | symbol | void | object | string[]',
                            },
                            uniqueId: '16',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnknown',
                            required: true,
                            typeValue: {
                                raw: 'unknown',
                            },
                            uniqueId: '5',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pVoid',
                            required: true,
                            typeValue: {
                                raw: 'void',
                            },
                            uniqueId: '7',
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
                            uniqueId: '8',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'aProp',
                            required: true,
                            typeValue: {
                                raw: "'black' | 'white'",
                            },
                            uniqueId: '1',
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
                            uniqueId: '9',
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
                            uniqueId: '7',
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
                            uniqueId: '6',
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
                            uniqueId: '5',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'propExternalTypeTest',
                            required: true,
                            typeValue: {
                                raw: 'HTMLElement',
                            },
                            uniqueId: '2',
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
                            uniqueId: '4',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'unionPropTest',
                            required: true,
                            typeValue: {
                                raw: 'TUnionTest',
                            },
                            uniqueId: '3',
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
                            uniqueId: '1',
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
                            uniqueId: '2',
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
                            uniqueId: '1',
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
                            uniqueId: '1',
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
                            uniqueId: '1',
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
                            uniqueId: '2',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'offsetLeft',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '3',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'offsetTop',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '4',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'srcData',
                            required: true,
                            typeValue: {
                                raw: 'TSrcData',
                            },
                            uniqueId: '1',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'targetHeight',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '6',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'targetWidth',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                            uniqueId: '5',
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

    test('should convert interface when it extends another interface and passes specific generic parameter to it', () => {
        const input = `
            interface IBaseInterface<T> {
                value: T;
                onValueChange(newValue: T): void;
            }            
            export interface IInterface extends IBaseInterface<string> {};
        `;
        const output = {
            '@epam/test-module': {
                IInterface: {
                    kind: 'InterfaceDeclaration',
                    props: [
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IBaseInterface',
                                    nameFull: 'IBaseInterface<T>',
                                },
                            },
                            kind: 'MethodSignature',
                            name: 'onValueChange',
                            required: true,
                            typeValue: {
                                raw: '(newValue: string) => void',
                            },
                            uniqueId: '2',
                        },
                        {
                            from: {
                                source: '../../../../test/test.tsx',
                                typeName: {
                                    name: 'IBaseInterface',
                                    nameFull: 'IBaseInterface<T>',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'value',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                            uniqueId: '1',
                        },
                    ],
                    typeRef: {
                        source: '../../../../test/test.tsx',
                        typeName: {
                            name: 'IInterface',
                            nameFull: 'IInterface',
                        },
                    },
                    typeValue: {
                        print: [
                            'interface IInterface extends IBaseInterface<string> {',
                            '}',
                        ],
                        raw: 'IInterface',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
