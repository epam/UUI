import { clearEmptyValueToRecord } from "./clearEmptyValueToRecord";

export const normalizeViewState = <TViewState = any>(viewState: TViewState) => {
    if (
        (viewState === undefined)
        || (viewState === null)
        || (typeof viewState !== 'object')
    ) {
        return viewState;
    }

    return clearEmptyValueToRecord<TViewState>(viewState);
};
