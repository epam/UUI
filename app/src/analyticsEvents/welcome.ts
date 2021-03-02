export const welcomeAnalyticsEvents = {
    gettingStarted: (role: string) => ({
        name: "welcome_getting_started_event",
        prm_role: role,
    }),
    whyToUse: (tab: string) => ({
        name: "welcome_why_to_use_event",
        prm_tab: tab,
    }),
    exploreAndDownload: (link: string) => ({
        name: "welcome_explore_and_download_event",
        prm_link: link,
    }),
    trusted: (product: string) => ({
        name: "welcome_trusted_event",
        prm_product: product,
    }),
    askDeveloper: (direction: string) => ({
        name: "welcome_ask_developer_event",
        prm_direction: direction,
    }),
    releaseNotes: (version: string) => ({
        name: "welcome_release_notes_event",
        prm_version: version,
    }),
    team: (teammate: string) => ({
        name: "welcome_team_event",
        prm_teammate: teammate,
    }),
    contact: (tool: string) => ({
        name: "welcome_contact_event",
        prm_tool: tool,
    }),
    openBacklog: () => ({
        name: "welcome_open_backlog_event",
    }),
    clickToolFooter: (tool: string) => ({
        name: "welcome_click_tool_footer_event",
        prm_tool: tool,
    }),
} as const;