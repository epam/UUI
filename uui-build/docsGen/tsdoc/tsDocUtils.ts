import {
    DocBlock,
    DocComment,
    DocPlainText,
    ParserContext,
    Standardization,
    TSDocConfiguration,
    TSDocParser,
    TSDocTagSyntaxKind,
} from '@microsoft/tsdoc';
import { TComment } from '../types/sharedTypes';

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
            const LF = '\n';
            const raw = srcComment.split(LF).map(cleanAsteriks).join(LF).trim()
                .split(LF);
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

        const tags = docComment.customBlocks.reduce<TComment['tags']>((acc, db) => {
            const name = db.blockTag.tagName as keyof typeof CUSTOM_TAGS;
            const tag = CUSTOM_TAGS[name];
            if (tag) {
                const parserRes = tag.parser(db);
                if (parserRes) {
                    const { extracted, value } = parserRes;
                    if (extracted) {
                        acc[name] = value;
                    }
                } else {
                    console.error(`Unable to parse tag=${name} from comment below. So, this tag will be ignored. Comment:\n${rawComment}`);
                }
            }
            return acc;
        }, {});
        if (Object.keys(tags).length > 0) {
            return tags;
        }
    }
}

const CUSTOM_TAGS = {
    '@default': {
        tagDefinition: {
            tagName: '@default',
            syntaxKind: TSDocTagSyntaxKind.BlockTag,
            standardization: Standardization.Discretionary,
            allowMultiple: false,
            tagNameWithUpperCase: '@DEFAULT',
        },
        parser: (db: DocBlock) => {
            const valueParts = db.getChildNodes()[1]; // DocSection
            const firstValuePart = valueParts.getChildNodes()[0]; // DocParagraph
            const txt = firstValuePart.getChildNodes()[0]; // DocPlainText
            if (txt instanceof DocPlainText) {
                const txtValue = txt?.text?.trim();
                if (typeof txtValue !== 'undefined') {
                    let value: boolean | string | number | null;

                    switch (txtValue) {
                        case 'true':
                        case 'false': {
                            value = txtValue === 'true';
                            break;
                        }
                        case 'null': {
                            value = null;
                            break;
                        }
                        default: {
                            if (!isNaN(+txtValue)) {
                                value = +txtValue;
                            } else if (txtValue[0] === '\'' && txtValue[txtValue.length - 1] === '\'') {
                                value = txtValue.substring(1, txtValue.length - 1);
                            } else {
                                return;
                            }
                            break;
                        }
                    }
                    return {
                        extracted: true,
                        value,
                    };
                }
            }
        },
    },
};

function cleanAsteriks(line: string): string {
    const regex1 = /^([\s]*\/[*]{1,2})(.*)$/; // leading /* or /**
    const regex2 = /^(.*)([\s]*[*]{1,2}\/)$/; // trailing */ or **/
    const regex3 = /^([\s]*[*]{1,1})(.*)$/; // leading *
    return line.replace(regex1, '$2').replace(regex2, '$1').replace(regex3, '$2');
}
