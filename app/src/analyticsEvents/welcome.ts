export const welcomeAnalyticsEvents = {
    gettingStarted: (role: string) => ({
        name: 'welcome_getting_started_event',
        prm_role: role,
    }),
    whyToUse: (tab: string) => ({
        name: 'welcome_why_to_use_event',
        prm_tab: tab,
    }),
    exploreAndDownload: (link: string) => ({
        name: 'welcome_explore_and_download_event',
        prm_link: link,
    }),
    trusted: (product: string) => ({
        name: 'welcome_trusted_event',
        prm_product: product,
    }),
    askDeveloper: (direction: string) => ({
        name: 'welcome_ask_developer_event',
        prm_direction: direction,
    }),
    releaseNotes: () => ({
        name: 'welcome_release_notes_event',
    }),
    team: (teammate: string) => ({
        name: 'welcome_team_event',
        prm_teammate: teammate,
    }),
    email: () => ({
        name: 'welcome_email_event',
    }),
    submitIssue: () => ({
        name: 'welcome_submit_issue_event',
    }),
    pv: () => ({
        name: 'welcome_pv',
    }),
} as const;
