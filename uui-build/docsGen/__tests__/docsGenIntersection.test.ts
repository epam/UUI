import { generateDocs } from './utils/test-utils';

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
