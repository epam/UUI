import { TDocGenStatsResult, TType, IDocGenStats, TTypeRef } from './types';

class DocGenStats implements IDocGenStats {
    private _mapTypeKeyToTypeRef = new Map<string, TTypeRef>();
    private _missingPropComment = new Map<string, string[]>();

    private result: TDocGenStatsResult = {
        missingPropComment: [],
        missingTypeComment: [],
        ignoredExports: {},
    };

    checkConvertedExport(converted: TType) {
        if (!converted.comment?.length) {
            this.result.missingTypeComment.push(converted.typeRef);
        }

        if (converted.props?.length) {
            converted.props.forEach((prop) => {
                // check only props which aren't inherited to avoid duplicates.
                if (!prop.comment?.length && !prop.from) {
                    const typeKey = `${converted.typeRef.module}:${converted.typeRef.typeName.name}`;
                    this._mapTypeKeyToTypeRef.set(typeKey, converted.typeRef);
                    let bucket = this._missingPropComment.get(typeKey);
                    if (!bucket) {
                        bucket = [];
                        this._missingPropComment.set(typeKey, bucket);
                    }
                    bucket.push(prop.name);
                }
            });
        }
    }

    addIgnoredExport(e: { module: string, kind: string, name: string }) {
        let bucket = this.result.ignoredExports[e.module];
        if (!bucket) {
            bucket = {};
            this.result.ignoredExports[e.module] = bucket;
        }
        if (!bucket[e.kind]) {
            bucket[e.kind] = [];
        }
        bucket[e.kind].push(e.name);
    }

    getResults(): TDocGenStatsResult {
        const missingPropComment: TDocGenStatsResult['missingPropComment'] = [];
        [...this._missingPropComment.entries()].forEach(([typeKeyStr, propNames]) => {
            missingPropComment.push({
                typeRef: this._mapTypeKeyToTypeRef.get(typeKeyStr),
                propNames,
            });
        });
        return {
            ...this.result,
            missingPropComment,
        };
    }
}

export const stats: IDocGenStats = new DocGenStats();
