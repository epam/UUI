import { act } from '@testing-library/react';

/**
 * For tests in NodeJs environment.
 * @param ms
 */
export const delay = (ms: number = 1): Promise<void> => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

/**
 * For tests of React components
 * https://legacy.reactjs.org/docs/testing-recipes.html#act
 *
 * Use this function only if absolutely necessary. Usually, you may want to consider other alternatives:
 *  - await find* queries
 *  - waitForElementToBeRemoved
 *  - waitFor
 *
 * @param ms
 */
export async function delayAct(ms: number = 1) {
    await act(() => delay(ms));
}
