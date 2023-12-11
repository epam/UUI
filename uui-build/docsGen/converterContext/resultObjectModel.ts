import {
    TTypeDetails,
    TTypeRef,
    TTypeSummary,
} from '../types/sharedTypes';
import { INCLUDED_PACKAGES } from '../constants';
import { TApiReferenceJson, TTypeConverted, TTypeRefMap } from '../types/types';
import { getUuiVersion } from '../utils/fileUtils';

const uuiVersion = getUuiVersion();

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
        const uuiIncl = Object.keys(INCLUDED_PACKAGES);
        const isUuiPackage = (module: string) => (module.indexOf('@epam/') === 0);
        const getIndexOfInclusion = (module: string) => uuiIncl.indexOf(module);

        const docsGenTypes: TTypeRefMap = {};
        const comparator = (a: TTypeRef, b: TTypeRef) => {
            const { exported: aExported, module: aModule } = this.typeSummaryMap[a];
            const { exported: bExported, module: bModule } = this.typeSummaryMap[b];
            /**
             * Priority:
             * 1. Types from @epam/* packages
             * 2. Types from a package specified in INCLUDED_PACKAGES (order matters here)
             * 3. Types which are exported from a packages (public ones)
             * 4. Types (types refs) in alphabetical order (ignore case)
             */
            return (Number(isUuiPackage(bModule)) - Number(isUuiPackage(aModule)))
                || (getIndexOfInclusion(aModule) - getIndexOfInclusion(bModule))
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
            docsGenTypes[typeRef] = result;
        });
        const out: TApiReferenceJson = {
            version: uuiVersion,
            docsGenTypes,
        };
        return JSON.parse(JSON.stringify(out)) as TApiReferenceJson; // remove any undefined props
    }
}
