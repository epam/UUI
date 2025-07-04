import { DocItem, componentsStructure, dataSourcesStructure, contextsStructure, advancedStructure } from '@epam/uui-docs';
import {
    OverviewDocItem, CoreConceptsDocItem, SupportDocItem, GettingStartedDocItem, AccessibilityDocItem,
    EmptyStatesDocItem, LayoutsDocItem, LoadersDocItem, ValidationDocItem, VisualExamplesDocItem,
    UtGuideBasicsDocItem, UtGuideCookbookDocItem, UtGuideGettingStartedDocItem, UtGuideToolsDocItem,
} from '@epam/uui-docs';
import { ProjectsDoc, ReleaseNotesDoc, TeamDoc } from '../docs/other';
import { IconsDoc, DownloadsDocItem, DownloadsDoc } from '../docs/assets';
import { ThemingOverviewDocItem, CreateThemeDocItem, VariablesDoc } from '../docs/themes';

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

    ...componentsStructure,

    { id: 'assets', name: 'Assets' },
    { id: 'icons', name: 'Icons', component: IconsDoc, parentId: 'assets' },
    DownloadsDocItem,

    ...dataSourcesStructure,

    ...contextsStructure,

    { id: 'themes', name: 'Themes' },
    ThemingOverviewDocItem,
    { id: 'tokens', name: 'Variables', component: VariablesDoc, parentId: 'themes', tags: ['colors', 'variables', 'tokens'] },
    CreateThemeDocItem,

    { id: 'testing', name: 'Testing' },
    UtGuideBasicsDocItem,
    UtGuideGettingStartedDocItem,
    UtGuideCookbookDocItem,
    UtGuideToolsDocItem,

    ...advancedStructure,

    AccessibilityDocItem,
    SupportDocItem,

    { id: 'projects', name: 'Projects', component: ProjectsDoc },

    { id: 'team', name: 'Team', component: TeamDoc },
    { id: 'releaseNotes', name: 'Release Notes', component: ReleaseNotesDoc },
];
