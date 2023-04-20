import { headerAnalyticsEvents } from './header';
import { welcomeAnalyticsEvents } from './welcome';
import { documentAnalyticsEvents } from './document';
import { demoAnalyticsEvents } from './demo';

export const analyticsEvents = {
    header: headerAnalyticsEvents,
    welcome: welcomeAnalyticsEvents,
    document: documentAnalyticsEvents,
    demo: demoAnalyticsEvents,
} as const;
export * from './listeners';
