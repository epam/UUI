import {
    TDocGenStatsResult,
    IDocGenStats,
    TDocGenStatsResult_Exports, IConverterContext,
} from '../types/types';
import { TType, TTypeRefShort } from '../types/docsGenSharedTypes';

export class DocGenStats implements IDocGenStats {
    private missingPropComment = new MapByTypeRef();
    private missingTypeComment: TDocGenStatsResult['missingTypeComment']['value'] = [];
    private ignoredExports = new ExportStat();
    private includedExports = new ExportStat();

    constructor(private context: IConverterContext) {
    }

    checkConvertedExport(converted: TType, isDirectExport: boolean) {
        if (isDirectExport && !converted.comment?.length) {
            this.missingTypeComment.push(converted.typeRef);
        }

        if (converted.props?.length) {
            converted.props.forEach((prop) => {
                // check only props which aren't inherited to avoid duplicates.
                if (!prop.comment?.length && !prop.from) {
                    let bucket = this.missingPropComment.get(converted.typeRef);
                    if (!bucket) {
                        bucket = [];
                        this.missingPropComment.set(converted.typeRef, bucket);
                    }
                    bucket.push(prop.name);
                }
            });
        }
    }

    addIncludedExport(e: { module: string, kind: string, name: string }) {
        this.includedExports.add(e);
    }

    addIgnoredExport(e: { module: string, kind: string, name: string }) {
        this.ignoredExports.add(e);
    }

    getResults(): TDocGenStatsResult {
        const missingPropCommentJson = this.missingPropComment.toJSON();
        const missingPropCommentTotals = missingPropCommentJson.reduce<{ amountProps: number, amountTypes: number }>((acc, c) => {
            acc.amountTypes++;
            acc.amountProps += c.value.length;
            return acc;
        }, { amountProps: 0, amountTypes: 0 });

        return {
            missingPropComment: {
                totals: missingPropCommentTotals,
                value: missingPropCommentJson,
            },
            missingTypeComment: {
                totals: {
                    amountTypes: this.missingTypeComment.length,
                },
                value: this.missingTypeComment,
            },
            ignoredExports: this.ignoredExports.toJSON(),
            includedExports: this.includedExports.toJSON(),
            references: this.context.references.get(),
        };
    }
}
class ExportStat {
    private value: Record<string, { [kind: string]: string[] }> = {};

    add(e: { module: string, kind: string, name: string }) {
        let bucket = this.value[e.module];
        if (!bucket) {
            bucket = {};
            this.value[e.module] = bucket;
        }
        if (!bucket[e.kind]) {
            bucket[e.kind] = [];
        }
        bucket[e.kind].push(e.name);
    }

    toJSON(): TDocGenStatsResult_Exports {
        const byModule: Record<string, number> = {};
        let allExports = 0;

        Object.keys(this.value).forEach((moduleKey) => {
            const amountInModule = Object.keys(this.value[moduleKey]).reduce((acc, kindKey) => {
                return acc + this.value[moduleKey][kindKey].length;
            }, 0);
            byModule[moduleKey] = amountInModule;
            allExports += amountInModule;
        });

        return {
            totals: {
                allExports,
                byModule,
            },
            value: this.value,
        };
    }
}

class MapByTypeRef {
    private _map = new Map<TTypeRefShort, string[]>();

    set(key: TTypeRefShort, value: string[]) {
        this._map.set(key, value);
    }

    get(key: TTypeRefShort): string[] | undefined {
        return this._map.get(key);
    }

    toJSON(): { typeRef: TTypeRefShort, value: string[] }[] {
        const result: { typeRef: TTypeRefShort, value: string[] }[] = [];
        [...this._map.entries()].forEach(([typeRefShort, value]) => {
            result.push({
                typeRef: typeRefShort,
                value: [...value].sort() as string[],
            });
        });
        return result;
    }
}