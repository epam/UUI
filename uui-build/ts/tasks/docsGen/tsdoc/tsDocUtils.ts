import {
    DocComment,
    ParserContext,
    TSDocConfiguration,
    TSDocParser,
} from '@microsoft/tsdoc';
import { TComment } from '../types/sharedTypes';
import { cleanAsteriks } from './tsDocFormatters';
import { CORE_TAGS, CUSTOM_TAGS } from './tsDocTags';

export class TsDocUtils {
    static isCommentEmpty(comment: TComment | undefined): boolean {
        let isEmpty = true;
        if (comment && comment.raw.length > 0) {
            const commentStrWithoutTags = comment.raw.filter((r) => {
                // Exclude the lines which contain tags (e.g.: @default)
                return r.trim().indexOf('@') !== 0;
            }).join('\n').trim();
            isEmpty = commentStrWithoutTags.length === 0;
        }
        return isEmpty;
    }

    static parseComment(srcComment: string): TComment | undefined {
        const isTsDoc = srcComment.indexOf('/**') === 0;
        if (isTsDoc) {
            const NL_LINUX = '\n';
            const NL_ANY_REGEX = /\r?\n/g;
            const raw = srcComment.split(NL_ANY_REGEX).map(cleanAsteriks).join(NL_LINUX).trim()
                .split(NL_LINUX);
            return {
                raw,
                tags: TsDocUtils.parseCommentTags(srcComment),
            };
        }
    }

    static parseCommentTags(rawComment: string): TComment['tags'] {
        const cfg = Object.values(CUSTOM_TAGS).reduce((acc, { tagDefinition }) => {
            acc.addTagDefinition(tagDefinition);
            return acc;
        }, new TSDocConfiguration());
        const tsdocParser: TSDocParser = new TSDocParser(cfg);
        const parserContext: ParserContext = tsdocParser.parseString(rawComment);
        const docComment: DocComment = parserContext.docComment;

        const tags = docComment.customBlocks.reduce<TComment['tags']>((acc = {}, db) => {
            const name = db.blockTag.tagName as keyof typeof CUSTOM_TAGS;
            const tag = CUSTOM_TAGS[name];
            if (tag) {
                const parserRes = tag.parser(db);
                if (parserRes) {
                    const { extracted, value } = parserRes;
                    if (extracted) {
                        acc[name] = value as any;
                    }
                } else {
                    console.error(`Unable to parse tag=${name} from comment below. So, this tag will be ignored. Comment:\n${rawComment}`);
                }
            }
            return acc;
        }, {});

        if (docComment.deprecatedBlock) {
            const parserRes = CORE_TAGS['@deprecated'].parser(docComment.deprecatedBlock);
            if (parserRes) {
                const { extracted, value } = parserRes;
                if (extracted) {
                    tags!['@deprecated'] = value;
                }
            }
        }

        if (Object.keys(tags || {}).length > 0) {
            return tags;
        }
    }
}
