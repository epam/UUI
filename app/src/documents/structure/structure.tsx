import React from 'react';
import OverviewDocItem from 'uui-doc-pages/overview.json';
import CoreConceptsDocItem from 'uui-doc-pages/coreConcepts.json';
import SupportDocItem from 'uui-doc-pages/components/support.json';
import GettingStartedDocItem from 'uui-doc-pages/gettingStarted.json';
import AccessibilityDocItem from 'uui-doc-pages/accessibility.json';
import EmptyStatesDocItem from 'uui-doc-pages/design/guidelines/emptyStates.json';
import LayoutsDocItem from 'uui-doc-pages/design/guidelines/layouts.json';
import LoadersDocItem from 'uui-doc-pages/design/guidelines/loaders.json';
import ValidationDocItem from 'uui-doc-pages/design/guidelines/validation.json';
import VisualExamplesDocItem from 'uui-doc-pages/design/visualExamples.json';
import UtGuideBasicsDocItem from 'uui-doc-pages/testing/utGuideBasics.json';
import UtGuideCookbookDocItem from 'uui-doc-pages/testing/utGuideCookbook.json';
import UtGuideGettingStartedDocItem from 'uui-doc-pages/testing/testing-getting-started.json';
import UtGuideToolsDocItem from 'uui-doc-pages/testing/utGuideTools.json';

import { ProjectsDoc, ReleaseNotesDoc, TeamDoc } from '../../docs/other';
import { IconsDoc, DownloadsDocItem, DownloadsDoc } from '../../docs/assets';
import { ThemingOverviewDocItem, CreateThemeDocItem, VariablesDoc } from '../../docs/themes';
import { componentsStructure } from './components';
import { DocItem } from '@epam/uui-docs';
import DataSourcesGettingStartedDocItem from 'uui-doc-pages/dataSources/gettingStarted.json';
import DataSourcesBaseDataSourcePropsDocItem from 'uui-doc-pages/dataSources/baseDataSourceProps.json';
import DataSourcesRowOptionsDocItem from 'uui-doc-pages/dataSources/rowOptions.json';
import DataSourcesDataSourceStateDocItem from 'uui-doc-pages/dataSources/dataSourceState.json';
import DataSourcesArrayDataSourceDocItem from 'uui-doc-pages/dataSources/arrayDataSource.json';
import DataSourcesAsyncDataSourceDocItem from 'uui-doc-pages/dataSources/asyncDataSource.json';
import DataSourcesLazyDataSourceDocItem from 'uui-doc-pages/dataSources/lazyDataSource.json';
import DataSourcesUsageDocItem from 'uui-doc-pages/dataSources/usage.json';
import ContextProviderDocItem from 'uui-doc-pages/contexts/contextProvider.json';
import ApiContextDocItem from 'uui-doc-pages/contexts/apiContext.json';
import AnalyticsContextDocItem from 'uui-doc-pages/contexts/analyticsContext.json';
import ModalContextDocItem from 'uui-doc-pages/contexts/modalContext.json';
import NotificationContextDocItem from 'uui-doc-pages/contexts/notificationContext.json';
import LockContextDocItem from 'uui-doc-pages/contexts/lockContext.json';
import InternationalizationDocItem from 'uui-doc-pages/advanced/internationalization.json';
import DragAndDropDocItem from 'uui-doc-pages/advanced/dragAndDrop.json';
import LensesDocItem from 'uui-doc-pages/advanced/lenses.json';

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
