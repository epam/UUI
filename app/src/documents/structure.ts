import {
    ContextProviderDoc, ApiContextDoc, ModalContextDoc,
    NotificationContextDoc, IconsDoc, DownloadsDoc, ProjectsDoc, ReleaseNotesDoc,
    LockContextDoc, InternationalizationDoc, TeamDoc, AnalyticsContextDoc, DragAndDropDoc,
    EmptyStatesDoc, LayoutsDoc, LoadersDoc, ValidationDoc, VisualExamplesDoc, GettingStartedDoc, UtGuideBasicsDoc, UtGuideToolsDoc,
    UtGuideCookbookDoc, DataSourcesGettingStartedDoc, DataSourcesRowOptionsDoc, DataSourcesBaseDataSourcePropsDoc,
    DataSourcesDataSourceStateDoc, DataSourcesArrayDataSourceDoc, DataSourcesAsyncDataSourceDoc,
    DataSourcesLazyDataSourceDoc, DataSourcesUsageDoc, OverviewDoc,
    ThemingOverview, VariablesDoc, AccessibilityDoc, UtGuideGettingStartedDoc, LensesDoc, CreateThemeDoc,
} from '../docs';
import { CoreConceptsDoc } from '../docs/CoreConcepts';
import { componentsStructure } from './structureComponents';

export interface DocItem {
    id: string;
    name: string;
    component?: any;
    parentId?: string;
    order?: number;
    tags?: string[];
}

export const items: DocItem[] = [
    { id: 'overview', name: 'Overview', component: OverviewDoc },
    { id: 'gettingStarted', name: 'Getting Started', component: GettingStartedDoc },
    { id: 'coreConcepts', name: 'Core Concepts', component: CoreConceptsDoc },
    { id: 'forDesigners', name: 'For Designers' },
    { id: 'gettingStartedForDesigners', name: 'Getting Started', component: DownloadsDoc, parentId: 'forDesigners' },
    { id: 'guidelines', name: 'Guidelines', parentId: 'forDesigners' },
    { id: 'emptyStates', name: 'Empty States', component: EmptyStatesDoc, parentId: 'guidelines' },
    { id: 'layouts', name: 'Layouts', component: LayoutsDoc, parentId: 'guidelines' },
    { id: 'loaders', name: 'Loaders', component: LoadersDoc, parentId: 'guidelines' },
    { id: 'validation', name: 'Validation', component: ValidationDoc, parentId: 'guidelines' },
    { id: 'visualExamples', name: 'Visual Examples', component: VisualExamplesDoc, parentId: 'forDesigners' },

    { id: 'components', name: 'Components' },
    ...componentsStructure,

    { id: 'assets', name: 'Assets' },
    { id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets' },
    // { id: 'promoColors', name: 'Colors', component: ColorsPageDoc, parentId: 'assets' },
    { id: 'downloads', name: 'Downloads', component: DownloadsDoc, parentId: 'assets' },

    { id: 'dataSources', name: 'DataSources' },
    { id: 'dataSources-getting-started', name: 'Getting Started', component: DataSourcesGettingStartedDoc, parentId: 'dataSources' },
    { id: 'dataSources-base-props', name: 'DataSource Props', component: DataSourcesBaseDataSourcePropsDoc, parentId: 'dataSources' },
    { id: 'dataSources-row-options', name: 'Row Options', component: DataSourcesRowOptionsDoc, parentId: 'dataSources' },
    { id: 'dataSources-dataSource-state', name: 'DataSource State', component: DataSourcesDataSourceStateDoc, parentId: 'dataSources' },
    { id: 'dataSources-array-dataSource', name: 'ArrayDataSource', component: DataSourcesArrayDataSourceDoc, parentId: 'dataSources' },
    { id: 'dataSources-async-dataSource', name: 'AsyncDataSource', component: DataSourcesAsyncDataSourceDoc, parentId: 'dataSources' },
    { id: 'dataSources-lazy-dataSource', name: 'LazyDataSource', component: DataSourcesLazyDataSourceDoc, parentId: 'dataSources' },
    { id: 'dataSources-usage', name: 'Usage In Components', component: DataSourcesUsageDoc, parentId: 'dataSources' },

    { id: 'contexts', name: 'Contexts' },
    { id: 'contextProvider', name: 'Context Provider', component: ContextProviderDoc, parentId: 'contexts', tags: ['contexts'] },
    { id: 'apiContext', name: 'Api Context and Error Handling', component: ApiContextDoc, parentId: 'contexts', tags: ['contexts'] },
    { id: 'analyticsContext', name: 'Analytics Context', component: AnalyticsContextDoc, parentId: 'contexts', tags: ['contexts'] },
    { id: 'modalContext', name: 'Modal Context', component: ModalContextDoc, parentId: 'contexts', tags: ['contexts'] },
    { id: 'notificationContextDoc', name: 'Notification Context', component: NotificationContextDoc, parentId: 'contexts', tags: ['contexts'] },
    { id: 'lockContextDoc', name: 'Lock Context', component: LockContextDoc, parentId: 'contexts', tags: ['contexts'] },

    { id: 'themes', name: 'Themes' },
    { id: 'overviewThemes', name: 'Overview', component: ThemingOverview, parentId: 'themes' },
    { id: 'tokens', name: 'Variables', component: VariablesDoc, parentId: 'themes', tags: ['colors', 'variables', 'tokens'] },
    { id: 'createTheme', name: 'Create Theme', component: CreateThemeDoc, parentId: 'themes' },

    { id: 'testing', name: 'Testing' },
    { id: 'testing-basics', name: 'Basics', component: UtGuideBasicsDoc, parentId: 'testing' },
    { id: 'testing-getting-started', name: 'Getting Started', component: UtGuideGettingStartedDoc, parentId: 'testing' },
    { id: 'testing-cookbook', name: 'Cookbook', component: UtGuideCookbookDoc, parentId: 'testing' },
    { id: 'testing-tools', name: 'Tools', component: UtGuideToolsDoc, parentId: 'testing' },

    { id: 'advanced', name: 'Advanced' },
    { id: 'localization', name: 'Internationalization & RTL', component: InternationalizationDoc, parentId: 'advanced' },
    { id: 'dragAndDrop', name: 'Drag And Drop', component: DragAndDropDoc, parentId: 'advanced' },
    { id: 'lenses', name: 'Lenses', component: LensesDoc, parentId: 'advanced' },

    { id: 'Accessibility', name: 'Accessibility', component: AccessibilityDoc },

    { id: 'projects', name: 'Projects', component: ProjectsDoc },

    { id: 'team', name: 'Team', component: TeamDoc },
    { id: 'releaseNotes', name: 'Release Notes', component: ReleaseNotesDoc },
];
