import { componentsStructure } from './structureComponents';
import { TDocConfig } from '@epam/uui-docs';
import { OverviewDocItem } from '../docs/Overview.doc';
import { CoreConceptsDocItem } from '../docs/CoreConcepts';
import { EmptyStatesDocItem } from '../docs/design/guidelines/EmptyStates.doc';
import { LayoutsDocItem } from '../docs/design/guidelines/Layouts.doc';
import { LoadersDocItem } from '../docs/design/guidelines/Loaders.doc';
import { ValidationDocItem } from '../docs/design/guidelines/Validation.doc';
import { ThemingOverviewDocItem } from '../docs/themes/Overview.doc';
import { DataSourcesGettingStartedDocItem } from '../docs/dataSources/GettingStarted.doc';
import { UtGuideBasicsDocItem } from '../docs/testing/UtGuideBasics.doc';
import { UtGuideCookbookDocItem } from '../docs/testing/UtGuideCookbook.doc';
import { SupportDocItem } from '../docs/Support.doc';
import { GettingStartedDocItem } from '../docs/GettingStarted.doc';
import { AccessibilityDocItem } from '../docs/Accessibility.doc';
import { VisualExamplesDocItem } from '../docs/design/VisualExamples.doc';
import { DataSourcesBaseDataSourcePropsDocItem } from '../docs/dataSources/BaseDataSourceProps.doc';
import { DataSourcesRowOptionsDocItem } from '../docs/dataSources/RowOptions.doc';
import { DataSourcesDataSourceStateDocItem } from '../docs/dataSources/DataSourceState.doc';
import { DataSourcesArrayDataSourceDocItem } from '../docs/dataSources/ArrayDataSource.doc';
import { DataSourcesAsyncDataSourceDocItem } from '../docs/dataSources/AsyncDataSource.doc';
import { DataSourcesLazyDataSourceDocItem } from '../docs/dataSources/LazyDataSource.doc';
import { DataSourcesUsageDocItem } from '../docs/dataSources/Usage.doc';
import { UtGuideGettingStartedDocItem } from '../docs/testing/UtGuideGetttingStarted.doc';
import { UtGuideToolsDocItem } from '../docs/testing/UtGuideTools.doc';
import { CreateThemeDocItem } from '../docs/themes/CreateTheme.doc';
import { InternationalizationDocItem } from '../docs/advanced/Internationalization.doc';
import { DragAndDropDocItem } from '../docs/advanced/DragAndDrop.doc';
import { LensesDocItem } from '../docs/Lenses.doc';
import { ContextProviderDocItem } from '../docs/contexts/ContextProvider.doc';
import { ApiContextDocItem } from '../docs/contexts/ApiContext.doc';
import { AnalyticsContextDocItem } from '../docs/contexts/AnalyticsContext.doc';
import { ModalContextDocItem } from '../docs/contexts/ModalContext.doc';
import { NotificationContextDocItem } from '../docs/contexts/NotificationContext.doc';
import { LockContextDocItem } from '../docs/contexts/LockContext.doc';
import { CX } from '@epam/uui-core';
import { ThemeId } from '../data';
import { DownloadsDoc, IconsDoc, ProjectsDoc, ReleaseNotesDoc, TeamDoc, VariablesDoc } from '../docs';

export interface DocItem {
    id: string;
    name: string;
    component?: any;
    examples?: {
        name?: string;
        componentPath?: any;
        descriptionPath?: string;
        onlyCode?: boolean; // if true, then the example will be rendered without description
        cx?: CX;
        themes?: ThemeId[];
    }[];
    explorerConfig?: TDocConfig;
    parentId?: string;
    order?: number;
    tags?: string[];
}

export const items: DocItem[] = [
    OverviewDocItem,
    GettingStartedDocItem,
    CoreConceptsDocItem,
    { id: 'forDesigners', name: 'For Designers' },
    { id: 'gettingStartedForDesigners', name: 'Getting Started', component: DownloadsDoc, parentId: 'forDesigners' },
    { id: 'guidelines', name: 'Guidelines', parentId: 'forDesigners' },
    EmptyStatesDocItem,
    LayoutsDocItem,
    LoadersDocItem,
    ValidationDocItem,
    VisualExamplesDocItem,

    { id: 'components', name: 'Components' },
    ...componentsStructure,

    { id: 'assets', name: 'Assets' },
    { id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets' },
    { id: 'downloads', name: 'Downloads', component: DownloadsDoc, parentId: 'assets' },

    { id: 'dataSources', name: 'DataSources' },
    DataSourcesGettingStartedDocItem,
    DataSourcesBaseDataSourcePropsDocItem,
    DataSourcesRowOptionsDocItem,
    DataSourcesDataSourceStateDocItem,
    DataSourcesArrayDataSourceDocItem,
    DataSourcesAsyncDataSourceDocItem,
    DataSourcesLazyDataSourceDocItem,
    DataSourcesUsageDocItem,

    { id: 'contexts', name: 'Contexts' },
    ContextProviderDocItem,
    ApiContextDocItem,
    AnalyticsContextDocItem,
    ModalContextDocItem,
    NotificationContextDocItem,
    LockContextDocItem,

    { id: 'themes', name: 'Themes' },
    ThemingOverviewDocItem,
    { id: 'tokens', name: 'Variables', component: VariablesDoc, parentId: 'themes', tags: ['colors', 'variables', 'tokens'] },
    CreateThemeDocItem,

    { id: 'testing', name: 'Testing' },
    UtGuideBasicsDocItem,
    UtGuideGettingStartedDocItem,
    UtGuideCookbookDocItem,
    UtGuideToolsDocItem,

    { id: 'advanced', name: 'Advanced' },
    InternationalizationDocItem,
    DragAndDropDocItem,
    LensesDocItem,

    AccessibilityDocItem,
    SupportDocItem,

    { id: 'projects', name: 'Projects', component: ProjectsDoc },

    { id: 'team', name: 'Team', component: TeamDoc },
    { id: 'releaseNotes', name: 'Release Notes', component: ReleaseNotesDoc },
];
