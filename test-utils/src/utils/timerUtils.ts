import { act } from '../extensions/testingLibraryReactExt';

/**
 * Don't use it in jsdom environment, because it's not wrapped in act.
 * You may want to use delayWrapInAct instead.
 *
 * @param ms
 */
export const delay = (ms: number = 1): Promise<void> => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

/**
 * Use this function only if absolutely necessary. Usually, you may want to consider other alternatives:
 *  - waitForElementToBeRemoved
 *  - waitFor
 *
 * @param ms
 */
export async function delayWrapInAct(ms: number = 1) {
    await act(() => delay(ms));
}
