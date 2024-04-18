/* eslint-disable no-restricted-imports */
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween.js';

export type { Dayjs } from 'dayjs';

export const dayJsHelper = TREE_SHAKEABLE_INIT();

function TREE_SHAKEABLE_INIT() {
    let extended = false;
    return {
        get dayjs() {
            if (!extended) {
                dayjs.extend(isBetween);
                extended = true;
            }
            return dayjs;
        },
    };
}
