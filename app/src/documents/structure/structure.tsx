import React from 'react';
import OverviewDocItem from '../../docs/pages/overview.json';
import CoreConceptsDocItem from '../../docs/pages/coreConcepts.json';
import SupportDocItem from '../../docs/pages/components/support.json';
import GettingStartedDocItem from '../../docs/pages/gettingStarted.json';
import AccessibilityDocItem from '../../docs/pages/accessibility.json';
import EmptyStatesDocItem from '../../docs/pages/design/guidelines/emptyStates.json';
import LayoutsDocItem from '../../docs/pages/design/guidelines/layouts.json';
import LoadersDocItem from '../../docs/pages/design/guidelines/loaders.json';
import ValidationDocItem from '../../docs/pages/design/guidelines/validation.json';
import VisualExamplesDocItem from '../../docs/pages/design/visualExamples.json';
import UtGuideBasicsDocItem from '../../docs/pages/testing/utGuideBasics.json';
import UtGuideCookbookDocItem from '../../docs/pages/testing/utGuideCookbook.json';
import UtGuideGettingStartedDocItem from '../../docs/pages/testing/testing-getting-started.json';
import UtGuideToolsDocItem from '../../docs/pages/testing/utGuideTools.json';

import { ProjectsDoc, ReleaseNotesDoc, TeamDoc } from '../../docs/pages/other';
import { IconsDoc, DownloadsDocItem, DownloadsDoc } from '../../docs/pages/assets';
import { ThemingOverviewDocItem, CreateThemeDocItem, ThemeVariablesDocItem } from '../../docs/pages/themes';
import { componentsStructure } from './components';
import { DocItem } from '@epam/uui-docs';
import DataSourcesGettingStartedDocItem from '../../docs/pages/dataSources/gettingStarted.json';
import DataSourcesBaseDataSourcePropsDocItem from '../../docs/pages/dataSources/baseDataSourceProps.json';
import DataSourcesRowOptionsDocItem from '../../docs/pages/dataSources/rowOptions.json';
import DataSourcesDataSourceStateDocItem from '../../docs/pages/dataSources/dataSourceState.json';
import DataSourcesArrayDataSourceDocItem from '../../docs/pages/dataSources/arrayDataSource.json';
import DataSourcesAsyncDataSourceDocItem from '../../docs/pages/dataSources/asyncDataSource.json';
import DataSourcesLazyDataSourceDocItem from '../../docs/pages/dataSources/lazyDataSource.json';
import DataSourcesUsageDocItem from '../../docs/pages/dataSources/usage.json';
import ContextProviderDocItem from '../../docs/pages/contexts/contextProvider.json';
import ApiContextDocItem from '../../docs/pages/contexts/apiContext.json';
import AnalyticsContextDocItem from '../../docs/pages/contexts/analyticsContext.json';
import ModalContextDocItem from '../../docs/pages/contexts/modalContext.json';
import NotificationContextDocItem from '../../docs/pages/contexts/notificationContext.json';
import LockContextDocItem from '../../docs/pages/contexts/lockContext.json';
import InternationalizationDocItem from '../../docs/pages/advanced/internationalization.json';
import DragAndDropDocItem from '../../docs/pages/advanced/dragAndDrop.json';
import LensesDocItem from '../../docs/pages/advanced/lenses.json';

export const items: DocItem[] = [
    OverviewDocItem,
    GettingStartedDocItem,
    CoreConceptsDocItem,
    { id: 'forDesigners', name: 'For Designers' },
    { id: 'gettingStartedForDesigners', name: 'Getting Started', renderContent: () => <DownloadsDoc />, parentId: 'forDesigners' },
    { id: 'guidelines', name: 'Guidelines', parentId: 'forDesigners' },
    EmptyStatesDocItem,
    LayoutsDocItem,
    LoadersDocItem,
    ValidationDocItem,
    VisualExamplesDocItem,

    ...componentsStructure,

    { id: 'assets', name: 'Assets' },
    { id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets' },
    DownloadsDocItem,

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
    ThemeVariablesDocItem,
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
