import { generateDocs } from './utils/test-utils';

describe('docsGen', () => {
    test('should convert mapped type', () => {
        const input = `
            export type TLocal = {
                [key: number]: string;
            }
        `;
        const output = {
            '@epam/test-module': {
                TLocal: {
                    kind: 'TypeAliasDeclaration',
                    typeName: {
                        name: 'TLocal',
                        nameFull: 'TLocal',
                    },
                    typeValue: {
                        print: [
                            'type TLocal = {',
                            '    [key: number]: string;',
                            '};',
                        ],
                        raw: 'TLocal',
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
    test('should convert internal type if it is wrapped in utility type', () => {
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
                    typeName: {
                        name: 'TTest',
                        nameFull: 'TTest',
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
    test('should show generic parameters in type name', () => {
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
                    typeName: {
                        name: 'IA',
                        nameFull: 'IA<T>',
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
                    typeName: {
                        name: 'TA',
                        nameFull: 'TA<S>',
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
                    props: [
                        {
                            from: {
                                typeName: {
                                    name: 'IFirstPart1',
                                    nameFull: 'IFirstPart1',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'IFirstPart2',
                                    nameFull: 'IFirstPart2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f3',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'IFirstPart2',
                                    nameFull: 'IFirstPart2',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'f4',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'TSecond',
                                    nameFull: 'TSecond',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 's1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'TSecond',
                                    nameFull: 'TSecond',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 's2',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                    ],
                    typeName: {
                        name: 'TIntersection',
                        nameFull: 'TIntersection',
                    },
                    typeValue: {
                        print: [
                            "type TIntersection = Omit<TFirst, 'f2'> & TSecond;",
                        ],
                        raw: 'TIntersection',
                    },
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
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'aProp',
                            required: true,
                            typeValue: {
                                raw: "'black' | 'white'",
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'ITestB',
                                    nameFull: 'ITestB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'bProp',
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
                                raw: "false | true | 'one' | 'two' | 'three' | 'four'",
                            },
                        },
                    ],
                    typeName: {
                        name: 'ITestA',
                        nameFull: 'ITestA',
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
                            name: 'bProp',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                    ],
                    typeName: {
                        name: 'ITestB',
                        nameFull: 'ITestB',
                    },
                    typeValue: {
                        print: [
                            'interface ITestB {',
                            '    bProp: number;',
                            '}',
                        ],
                        raw: 'ITestB',
                    },
                },
                TExternalTypeTest: {
                    kind: 'TypeAliasDeclaration',
                    typeName: {
                        name: 'TExternalTypeTest',
                        nameFull: 'TExternalTypeTest',
                    },
                    typeValue: {
                        print: [
                            'type TExternalTypeTest = HTMLElement;',
                        ],
                        raw: 'HTMLElement',
                    },
                },
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    props: [
                        {
                            from: {
                                typeName: {
                                    name: 'TIntersectionMemberA',
                                    nameFull: 'TIntersectionMemberA',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'a1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'TIntersectionMemberA',
                                    nameFull: 'TIntersectionMemberA',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'a2',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'IIntersectionMemberB',
                                    nameFull: 'IIntersectionMemberB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'b1',
                            required: true,
                            typeValue: {
                                raw: 'number',
                            },
                        },
                        {
                            from: {
                                typeName: {
                                    name: 'IIntersectionMemberB',
                                    nameFull: 'IIntersectionMemberB',
                                },
                            },
                            kind: 'PropertySignature',
                            name: 'b2',
                            required: true,
                            typeValue: {
                                raw: 'string',
                            },
                        },
                    ],
                    typeName: {
                        name: 'TIntersection',
                        nameFull: 'TIntersection',
                    },
                    typeValue: {
                        print: [
                            'type TIntersection = TIntersectionMemberA & IIntersectionMemberB;',
                        ],
                        raw: 'TIntersection',
                    },
                },
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
                    typeName: {
                        name: 'TPrimitives',
                        nameFull: 'TPrimitives',
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
                TUnionTest: {
                    comment: [
                        'This is a multiline TSDoc for direct export of union type.',
                    ],
                    kind: 'TypeAliasDeclaration',
                    typeName: {
                        name: 'TUnionTest',
                        nameFull: 'TUnionTest',
                    },
                    typeValue: {
                        print: [
                            '/**',
                            ' * This is a multiline TSDoc for direct export of union type.',
                            ' */',
                            "type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;",
                        ],
                        raw: "false | true | 'one' | 'two' | 'three' | 'four'",
                    },
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
