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
                            inheritedFrom: 'ITestB',
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
