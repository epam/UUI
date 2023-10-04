import { generateDocs } from './utils/test-utils';

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
});
