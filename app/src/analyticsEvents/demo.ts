export const demoAnalyticsEvents = {
    scenarioSelect: (demo: string) => ({
        name: 'demo_scenario_select_event',
        prm_demo: demo,
    }),
    scenarioGit: (demo: string) => ({
        name: 'demo_scenario_git_event',
        prm_demo: demo,
    }),
    pv: (page: string) => ({
        name: 'demo_pv',
        prm_page: page,
    }),
} as const;
