export const headerAnalyticsEvents = {
    link: (link: string) => ({
        name: 'header_link_event',
        prm_link: link,
    }),
} as const;
