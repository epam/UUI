import { generateDocs } from './utils/test-utils';

describe('docsGen:all', () => {
    describe('docsGen:comments', () => {
        test('should convert comments', () => {
            const input = `
            /**
             * This is an export level multiline TSDoc.
            */
            export interface ITest {
                // Single line comment should be ignored
                a: number;
                /** This is property-level TSDoc */
                b: number;
            }
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
        test('should convert property-level tags', () => {
            const input = `
            export interface ITest {
                /** 
                 * This is property "a"
                 * @default true
                 */
                a: boolean;
                /** 
                 * This is property "b"
                 * @default 100
                 */
                b: number;
                /** 
                 * This is property "c"
                 * @default 'hello'
                 */
                c: string;
                /** 
                 * This is property "d"
                 * @default null
                 */
                d: string;
            }
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
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

        test('should mark props as optional when type extends from Partial of another type', () => {
            const input = `
            interface IFirstType {
                value: boolean;
            }
            
            export interface ISecondType extends Partial<IFirstType> {};
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
    describe('docsGen:intersection', () => {
        test('should convert intersection', () => {
            const input = `
            type TIntersectionMemberA = {
                a1: number;
                a2: string;
            }
            interface IIntersectionMemberB {
                b1: number;
                b2: string;
            }
            export type TIntersection = TIntersectionMemberA & IIntersectionMemberB;
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
        test('should convert top level type with Omit', () => {
            const input = `
            interface TFirst {
                f1: number;
                f2: number;
            }
            export type TIntersection = Omit<TFirst, 'f2'>;
        `;
            expect(generateDocs(input)).toMatchSnapshot();
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
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
    describe('docsGen:mappedType', () => {
        test('should convert mapped type', () => {
            const input = `
            export type TLocal = {
                [key: number]: string;
            }
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
    describe('docsGen:propEditor', () => {
        test('should convert prop editor for optional icon prop', () => {
            const input = `
            type Icon = React.FC<any>;
            export interface TTest {
                icon?: Icon;
            };
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
    describe('docsGen:union', () => {
        test('should convert union of simple types', () => {
            const input = `
            export type TUnionTest = 'one' | 'two' | 'three' | 'four' | boolean;
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
        test('should convert union of two object types', () => {
            const input = `
            type N1 = ({ sameProp: string, n1Prop: string });
            type N2 = ({ sameProp: string, n2Prop: string });
            export type TTest = N1 | N2;
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });

        test('should convert union of two anonymous object types', () => {
            const input = `
            export type TTest = ({ sameProp: string, n1Prop: string }) | ({ sameProp: string, n2Prop: string });
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });

        test('should not try to expand props if union contains an external type', () => {
            const input = `
            export type TTest = ({ a: string, b: string }) | HTMLElement;
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });

        test('should not expand ReactNode type of property', () => {
            const input = `
            export interface TTestOptional {
                testProp?: React.ReactNode;
            };
            export interface TTestRequired {
                testProp: React.ReactNode;
            };
        `;
            expect(generateDocs(input)).toMatchSnapshot();
        });
    });
});
