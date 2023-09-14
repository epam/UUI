import { generateDocs } from './utils/test-utils';

describe('docsGen', () => {
    test('should convert type intersection with Omit', () => {
        const input = `
            interface IFirstPart1 {
                f1: number;
                f2: number;
            }
            interface IFirstPart2 {
                f3: number;
                f4: number;
            } 
            type TFirst = IFirstPart1 & IFirstPart2;
            type TSecond = {
                s1: number;
                s2: number;
            }
            export type TIntersection = Omit<TFirst, 'f2'> & TSecond;
        `;
        const output = {
            '@epam/test-module': {
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TIntersection',
                    props: [
                        {
                            from: {
                                name: 'IFirstPart1',
                            },
                            kind: 'PropertySignature',
                            name: 'f1',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'IFirstPart2',
                            },
                            kind: 'PropertySignature',
                            name: 'f3',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'IFirstPart2',
                            },
                            kind: 'PropertySignature',
                            name: 'f4',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'TSecond',
                            },
                            kind: 'PropertySignature',
                            name: 's1',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'TSecond',
                            },
                            kind: 'PropertySignature',
                            name: 's2',
                            required: true,
                            value: 'number',
                        },
                    ],
                    value: 'TIntersection',
                    valuePrint: [
                        "type TIntersection = Omit<TFirst, 'f2'> & TSecond;",
                    ],
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
    test('should convert all types', () => {
        const input = `
            /**
             * This is a multiline TSDoc for direct export of union type. 
             */
            export type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;
            export interface ITestB {
                bProp: number;
            }
            
            type TIntersectionMemberA = {
                a1: number;
                a2: string;
            }
            interface IIntersectionMemberB {
                b1: number;
                b2: string;
            }
            export type TIntersection = TIntersectionMemberA & IIntersectionMemberB;
            
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
            
            export type TExternalTypeTest = HTMLElement;
            
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
                    name: 'ITestA',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'aProp',
                            required: true,
                            value: "'black' | 'white'",
                        },
                        {
                            from: {
                                name: 'ITestB',
                            },
                            kind: 'PropertySignature',
                            name: 'bProp',
                            required: true,
                            value: 'number',
                        },
                        {
                            comment: [
                                'This is GetAccessor',
                            ],
                            kind: 'GetAccessor',
                            name: 'get someBool',
                            required: true,
                            value: 'get someBool(): boolean',
                        },
                        {
                            comment: [
                                'This is MethodDeclaration',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodDeclarationTest',
                            required: true,
                            value: '(p: number) => number',
                        },
                        {
                            comment: [
                                'This is MethodSignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodSignatureTest',
                            required: true,
                            value: '(a?: number | undefined, b?: number | undefined) => number | undefined',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'propExternalTypeTest',
                            required: true,
                            value: 'HTMLElement',
                        },
                        {
                            comment: [
                                'This is PropertySignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'propSignatureTest',
                            required: true,
                            value: '{ name: string; value: any; }[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'unionPropTest',
                            required: true,
                            value: "false | true | 'one' | 'two' | 'three' | 'four'",
                        },
                    ],
                    value: 'ITestA',
                    valuePrint: [
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
                },
                ITestB: {
                    kind: 'InterfaceDeclaration',
                    name: 'ITestB',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'bProp',
                            required: true,
                            value: 'number',
                        },
                    ],
                    value: 'ITestB',
                    valuePrint: [
                        'interface ITestB {',
                        '    bProp: number;',
                        '}',
                    ],
                },
                TExternalTypeTest: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TExternalTypeTest',
                    value: 'HTMLElement',
                    valuePrint: [],
                },
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TIntersection',
                    props: [
                        {
                            from: {
                                name: 'TIntersectionMemberA',
                            },
                            kind: 'PropertySignature',
                            name: 'a1',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'TIntersectionMemberA',
                            },
                            kind: 'PropertySignature',
                            name: 'a2',
                            required: true,
                            value: 'string',
                        },
                        {
                            from: {
                                name: 'IIntersectionMemberB',
                            },
                            kind: 'PropertySignature',
                            name: 'b1',
                            required: true,
                            value: 'number',
                        },
                        {
                            from: {
                                name: 'IIntersectionMemberB',
                            },
                            kind: 'PropertySignature',
                            name: 'b2',
                            required: true,
                            value: 'string',
                        },
                    ],
                    value: 'TIntersection',
                    valuePrint: [
                        'type TIntersection = TIntersectionMemberA & IIntersectionMemberB;',
                    ],
                },
                TPrimitives: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TPrimitives',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'pAny',
                            required: true,
                            value: 'any',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pArray',
                            required: true,
                            value: 'string[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBigint',
                            required: true,
                            value: 'bigint',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBool',
                            required: true,
                            value: 'false | true',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pLiteral',
                            required: true,
                            value: "'test'",
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNever',
                            required: true,
                            value: 'never',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNull',
                            required: true,
                            value: 'null',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNumber',
                            required: true,
                            value: 'number',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pObject',
                            required: true,
                            value: 'object',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pString',
                            required: true,
                            value: 'string',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pSymbol',
                            required: true,
                            value: 'symbol',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pTuple',
                            required: true,
                            value: "[boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test']",
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUndefined',
                            required: true,
                            value: 'undefined',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnion',
                            required: false,
                            value: 'undefined | null | string | number | bigint | false | true | symbol | void | object | string[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnknown',
                            required: true,
                            value: 'unknown',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pVoid',
                            required: true,
                            value: 'void',
                        },
                    ],
                    value: 'TPrimitives',
                    valuePrint: [
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
                },
                TUnionTest: {
                    comment: [
                        'This is a multiline TSDoc for direct export of union type.',
                    ],
                    kind: 'TypeAliasDeclaration',
                    name: 'TUnionTest',
                    value: "false | true | 'one' | 'two' | 'three' | 'four'",
                    valuePrint: [
                        '/**',
                        ' * This is a multiline TSDoc for direct export of union type.',
                        ' */',
                        "type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;",
                    ],
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
