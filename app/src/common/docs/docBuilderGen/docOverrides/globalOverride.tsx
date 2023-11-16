import * as uuiDocs from '../../../../docs/_props/uui/docs';
import { DocBuilder, TDocContext } from '@epam/uui-docs';

/**
 * This override is applied to each skin individually
 */
export const docCommonOverride = (params: { docs: DocBuilder<any>, contexts?: TDocContext[] }) => {
    const contexts = params.contexts?.length > 0 ? params.contexts : [TDocContext.Default];
    contexts.forEach((c) => {
        const ctx = uuiDocs.uuiDocContextsMap[c];
        if (ctx) {
            params.docs.withContexts(ctx);
        } else {
            console.error(`Context is not implemented in UUI: ${c}`);
        }
    });
};
