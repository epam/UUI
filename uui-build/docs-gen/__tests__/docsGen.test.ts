import { generateDocs } from './utils/test-utils';

describe('docsGen', () => {
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
                            optional: false,
                            value: "'black' | 'white'",
                        },
                        {
                            inheritedFrom: {
                                name: 'ITestB',
                            },
                            kind: 'PropertySignature',
                            name: 'bProp',
                            optional: false,
                            value: 'number',
                        },
                        {
                            comment: [
                                'This is GetAccessor',
                            ],
                            kind: 'GetAccessor',
                            name: 'get someBool',
                            optional: false,
                            value: 'get someBool(): boolean',
                        },
                        {
                            comment: [
                                'This is MethodDeclaration',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodDeclarationTest',
                            optional: false,
                            value: '(p: number) => number',
                        },
                        {
                            comment: [
                                'This is MethodSignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'methodSignatureTest',
                            optional: false,
                            value: '(a?: number | undefined, b?: number | undefined) => number | undefined',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'propExternalTypeTest',
                            optional: false,
                            value: 'HTMLElement',
                        },
                        {
                            comment: [
                                'This is PropertySignature',
                            ],
                            kind: 'PropertySignature',
                            name: 'propSignatureTest',
                            optional: false,
                            value: '{ name: string; value: any; }[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'unionPropTest',
                            optional: false,
                            value: "false | true | 'one' | 'two' | 'three' | 'four'",
                        },
                    ],
                    value: 'ITestA',
                },
                ITestB: {
                    kind: 'InterfaceDeclaration',
                    name: 'ITestB',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'bProp',
                            optional: false,
                            value: 'number',
                        },
                    ],
                    value: 'ITestB',
                },
                TExternalTypeTest: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TExternalTypeTest',
                    value: 'HTMLElement',
                },
                TIntersection: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TIntersection',
                    props: [
                        {
                            inheritedFrom: {
                                name: 'TIntersectionMemberA',
                            },
                            kind: 'PropertySignature',
                            name: 'a1',
                            optional: false,
                            value: 'number',
                        },
                        {
                            inheritedFrom: {
                                name: 'TIntersectionMemberA',
                            },
                            kind: 'PropertySignature',
                            name: 'a2',
                            optional: false,
                            value: 'string',
                        },
                        {
                            inheritedFrom: {
                                name: 'IIntersectionMemberB',
                            },
                            kind: 'PropertySignature',
                            name: 'b1',
                            optional: false,
                            value: 'number',
                        },
                        {
                            inheritedFrom: {
                                name: 'IIntersectionMemberB',
                            },
                            kind: 'PropertySignature',
                            name: 'b2',
                            optional: false,
                            value: 'string',
                        },
                    ],
                    value: 'TIntersection',
                },
                TPrimitives: {
                    kind: 'TypeAliasDeclaration',
                    name: 'TPrimitives',
                    props: [
                        {
                            kind: 'PropertySignature',
                            name: 'pAny',
                            optional: false,
                            value: 'any',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pArray',
                            optional: false,
                            value: 'string[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBigint',
                            optional: false,
                            value: 'bigint',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pBool',
                            optional: false,
                            value: 'false | true',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pLiteral',
                            optional: false,
                            value: "'test'",
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNever',
                            optional: false,
                            value: 'never',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNull',
                            optional: false,
                            value: 'null',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pNumber',
                            optional: false,
                            value: 'number',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pObject',
                            optional: false,
                            value: 'object',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pString',
                            optional: false,
                            value: 'string',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pSymbol',
                            optional: false,
                            value: 'symbol',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pTuple',
                            optional: false,
                            value: "[boolean, number, string, any, unknown, never, void, null, undefined, string[], object, bigint, symbol, 'test']",
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUndefined',
                            optional: false,
                            value: 'undefined',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnion',
                            optional: true,
                            value: 'undefined | null | string | number | bigint | false | true | symbol | void | object | string[]',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pUnknown',
                            optional: false,
                            value: 'unknown',
                        },
                        {
                            kind: 'PropertySignature',
                            name: 'pVoid',
                            optional: false,
                            value: 'void',
                        },
                    ],
                    value: 'TPrimitives',
                },
                TUnionTest: {
                    comment: [
                        'This is a multiline TSDoc for direct export of union type.',
                    ],
                    kind: 'TypeAliasDeclaration',
                    name: 'TUnionTest',
                    value: "false | true | 'one' | 'two' | 'three' | 'four'",
                },
            },
        };
        expect(generateDocs(input)).toEqual(output);
    });
});
