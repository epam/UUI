import {
    TTypeDetails,
    TTypeRef,
    TTypeRefMap,
    TTypeSummary,
} from '../types/sharedTypes';
import { INCLUDED_UUI_PACKAGES } from '../constants';
import { TApiReferenceJson, TTypeConverted } from '../types/types';

export class ResultObjectModel {
    private typeSummaryMap: Record<TTypeRef, TTypeSummary> = {};
    private typeDetailsMap: Record<TTypeRef, TTypeDetails> = {};

    addTypeSummary(typeRef: TTypeRef, summary: TTypeSummary) {
        if (!this.typeSummaryMap[typeRef]) {
            this.typeSummaryMap[typeRef] = summary;
        }
    }

    markAsExported(typeRef: TTypeRef) {
        const summary = this.typeSummaryMap[typeRef];
        if (summary) {
            summary.exported = true;
        }
    }

    addType(type: TTypeConverted) {
        this.addTypeSummary(type.typeRef, type.summary);
        if (!this.typeDetailsMap[type.typeRef] && type.details) {
            this.typeDetailsMap[type.typeRef] = type.details;
        }
    }

    getResults(): TApiReferenceJson {
        const uuiIncl = Object.keys(INCLUDED_UUI_PACKAGES);
        const isUuiPackage = (module: string) => (module.indexOf('@epam/') === 0);
        const inclIndex = (module: string) => uuiIncl.indexOf(module);

        const allTypes: TTypeRefMap = {};
        const comparator = (a: TTypeRef, b: TTypeRef) => {
            const { exported: aExported, module: aModule } = this.typeSummaryMap[a];
            const { exported: bExported, module: bModule } = this.typeSummaryMap[b];
            // Priority: UUI packages, Included packages, Included first, Exported entries, Alphabetical
            return (Number(isUuiPackage(bModule)) - Number(isUuiPackage(aModule)))
                || (Number(inclIndex(bModule) !== -1) - Number(inclIndex(aModule) !== -1))
                || (inclIndex(aModule) - inclIndex(bModule))
                || (Number(bExported) - Number(aExported))
                || (a.toLowerCase().localeCompare(b.toLowerCase()));
        };
        // Sort to make the output more stable and easy to read.
        const sortedKeys = (Object.keys(this.typeSummaryMap) as TTypeRef[]).sort(comparator);
        sortedKeys.forEach((ref) => {
            const typeRef = ref as TTypeRef;
            const summary = this.typeSummaryMap[typeRef];
            const details = this.typeDetailsMap[typeRef];
            const result: TTypeRefMap[keyof TTypeRefMap] = {
                summary,
            };
            if (details) {
                result.details = details;
            }
            allTypes[typeRef] = result;
        });
        return JSON.parse(JSON.stringify({ // remove any undefined props
            allTypes,
        }));
    }
}
