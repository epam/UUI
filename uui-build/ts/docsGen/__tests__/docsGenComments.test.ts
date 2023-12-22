import { generateDocs } from './utils/test-utils';

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
