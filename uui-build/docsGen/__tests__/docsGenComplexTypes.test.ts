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
        expect(generateDocs(input)).toMatchSnapshot();
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
        expect(generateDocs(input)).toMatchSnapshot();
    });

    test('should not expand props from external type', () => {
        const input = 'export type TExternalTypeTest = HTMLElement;';
        expect(generateDocs(input)).toMatchSnapshot();
    });

    test('should expand props if internal type is wrapped in Typescript utility type', () => {
        const input = `
            type TLocal = {
                p1: number;
                p2: string;
            }
            export type TTest = Omit<TLocal, 'p1'>;
        `;
        expect(generateDocs(input)).toMatchSnapshot();
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
        expect(generateDocs(input)).toMatchSnapshot();
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
        expect(generateDocs(input)).toMatchSnapshot();
    });

    test('should convert interface when it extends another interface and passes specific generic parameter to it', () => {
        const input = `
            interface IBaseInterface<T> {
                value: T;
                onValueChange(newValue: T): void;
            }            
            export interface IInterface extends IBaseInterface<string> {};
        `;
        expect(generateDocs(input)).toMatchSnapshot();
    });
});
