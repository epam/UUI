import { TsDocUtils } from '../tsDocUtils';

describe('TsDocUtils', () => {
    it('Should treat comment as empty if there are only tags in it', () => {
        const ONLY_TAGS_1 = '/** @default true */';
        const ONLY_TAGS_2 = `
        /** 
         * @default true 
         *
         */`.trim();
        expect(
            TsDocUtils.isCommentEmpty(TsDocUtils.parseComment(ONLY_TAGS_1)),
        ).toBeTruthy();
        expect(
            TsDocUtils.isCommentEmpty(TsDocUtils.parseComment(ONLY_TAGS_2)),
        ).toBeTruthy();
    });
    it('Should treat comment as non-empty if there is some text not related to tags.', () => {
        const NON_EMPTY_1 = '/** Hello, World! */'.trim();
        const NON_EMPTY_2 = `
        /** 
         * @default true 
         * Hello, World!
         */`.trim();
        const NON_EMPTY_3 = `
        /** 
         * Hello, World!
         * @default true 
         * 
         */`.trim();
        expect(
            TsDocUtils.isCommentEmpty(TsDocUtils.parseComment(NON_EMPTY_1)),
        ).toBeFalsy();
        expect(
            TsDocUtils.isCommentEmpty(TsDocUtils.parseComment(NON_EMPTY_2)),
        ).toBeFalsy();
        expect(
            TsDocUtils.isCommentEmpty(TsDocUtils.parseComment(NON_EMPTY_3)),
        ).toBeFalsy();
    });
});
