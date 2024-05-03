import { PlaywrightTestOptions } from '@playwright/test';

export const PLATFORM = 'linux';
export const PREVIEW_URL = '/preview';
export const PlayWrightInterfaceName = '_uui_playwright_interface';

/*
 */
export const SHARED_DEVICE_CFG: Record<string, Partial<PlaywrightTestOptions>> = {
    DEFAULT: {
        locale: 'en-US',
        timezoneId: 'EET',
        viewport: {
            width: 1024,
            height: 768,
        },
    },
};
