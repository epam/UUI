import { TDocGenStatsResult, TType, IDocGenStats, TTypeRef, typeRefToUniqueString } from './types';

class MapByTypeRef<TValue = string> {
    private _mapTypeKeyToTypeRef = new Map<string, TTypeRef>();
    private _mapTypeKeyToValue = new Map<string, TValue>();

    set(key: TTypeRef, value: TValue) {
        const k = typeRefToUniqueString(key);
        this._mapTypeKeyToTypeRef.set(k, key);
        this._mapTypeKeyToValue.set(k, value);
    }

    get(key: TTypeRef): TValue {
        const k = typeRefToUniqueString(key);
        return this._mapTypeKeyToValue.get(k);
    }

    toJSON(): { typeRef: TTypeRef, value: TValue }[] {
        const result: { typeRef: TTypeRef, value: TValue }[] = [];
        [...this._mapTypeKeyToValue.entries()].forEach(([typeKeyStr, value]) => {
            result.push({
                typeRef: this._mapTypeKeyToTypeRef.get(typeKeyStr),
                value,
            });
        });
        return result;
    }
}

class DocGenStats implements IDocGenStats {
    private missingPropComment = new MapByTypeRef<string[]>();
    private missingTypeComment: TDocGenStatsResult['missingTypeComment']['value'] = [];
    private ignoredExports: TDocGenStatsResult['ignoredExports']['value'] = {};

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

    addIgnoredExport(e: { module: string, kind: string, name: string }) {
        let bucket = this.ignoredExports[e.module];
        if (!bucket) {
            bucket = {};
            this.ignoredExports[e.module] = bucket;
        }
        if (!bucket[e.kind]) {
            bucket[e.kind] = [];
        }
        bucket[e.kind].push(e.name);
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
            ignoredExports: {
                totals: {
                    amountExports: Object.keys(this.ignoredExports).reduce((acc, moduleMapKey) => {
                        return acc + Object.keys(this.ignoredExports[moduleMapKey])
                            .reduce((accInner, kindMapKey) => {
                                return accInner + this.ignoredExports[moduleMapKey][kindMapKey].length;
                            }, 0);
                    }, 0),
                },
                value: this.ignoredExports,
            },
        };
    }
}

export const stats: IDocGenStats = new DocGenStats();
