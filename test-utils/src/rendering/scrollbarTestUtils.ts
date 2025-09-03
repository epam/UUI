import { delay } from './timerUtils';

/**
 * Waits for all scrollbar transitions to complete.
 * This utility helps prevent flaky snapshot tests caused by scrollbar transition states.
 */
export async function waitForScrollbarTransitionsToComplete(): Promise<void> {
    // Wait for any pending CSS transitions to complete
    // The default transition duration in ScrollBars.module.scss is 200ms
    await delay(250);
}
