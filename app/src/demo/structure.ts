import { DemoForm } from './form';
import { DemoDnd } from './dnd';
import { TimelineDemo } from './timeline/TimelineDemo';
import { MasterDetailedTable } from './tables/masterDetailedTable';
import { FilteredTable } from './tables/filteredTable';
import { ProjectTableDemo } from './tables/editableTable';
import { RichTextEditorDemo } from './RTE/RichTextEditorDemo';

export interface DemoItem {
    id: string;
    queryObject?: Record<string, any>;
    name: string;
    component?: any;
    source: string;
    previewImage: string;
    shortDescription: string;
}

export const demoItems: DemoItem[] = [
    {
        id: 'dnd',
        name: 'Drag & Drop',
        component: DemoDnd,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/dnd',
        previewImage: '/static/images/DemoDnD.png',
        shortDescription: 'In UUI, every component can be made draggable, and/or accept dragged items, by wrapping it with DndActor component.',
    },
    {
        id: 'form',
        name: 'Form',
        component: DemoForm,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/form',
        previewImage: '/static/images/DemoForms.png',
        shortDescription:
            'UUI contains a full-featured set of Form components – TextInputs, Date Pickers, etc. We also provide useForm hook – to manage form state, including validation.',
    },
    {
        id: 'table',
        name: 'Table',
        component: MasterDetailedTable,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/tables/masterDetailedTable',
        previewImage: '/static/images/DemoTable.png',
        shortDescription:
            'Shows how UUI Data Tables allow to display and navigate data sets. We also show how to add sidebars to configure filters, and to review each item’s detailed info. The demo shows common built-in table features.',
    },
    {
        id: 'filteredTable',
        queryObject: { page: 1, pageSize: 40, presetId: '-1' },
        name: 'Filtered Table',
        component: FilteredTable,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/tables/filteredTable',
        previewImage: '/static/images/DemoTable.png',
        shortDescription:
            'Shows support for advanced filter toolbar – including predicates (in/not in/less/greater than), and user-defined filter presets (tabs). This demo also uses paging instead of infinite-scrolling.',
    },
    {
        id: 'editableTable',
        name: 'Project Planning',
        component: ProjectTableDemo,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/tables/editableTable',
        previewImage: '/static/images/DemoEditableTable.png',
        shortDescription:
            `Project planning UX, built on top of tables editing capabilities.
            Demo highlights in-cell inputs, drag-n-drop, tree-structured data, and more.
            `,
    },
    {
        id: 'RTE',
        name: 'Rich Text Editor',
        component: RichTextEditorDemo,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/RTE',
        previewImage: '/static/images/DemoRTE.png',
        shortDescription:
            'UUI contains full-featured Rich Text Editor, which is based on popular slate.js library. On top of Slate.js, we add a set of our and 3rd party plugins, UUI-styled toolbars, align edited text style to our guidelines. As slate.js in highly extensible, end-users can further customize it – toggle and configure existing plugins or add own or existing 3rd party plugins.',
    },
    {
        id: 'timeline',
        name: 'Timeline',
        component: TimelineDemo,
        source: 'https://github.com/epam/UUI/tree/main/app/src/demo/timeline',
        previewImage: '/static/images/DemoTimeline.png',
        shortDescription:
            '@epam/uui-timeline module provides components to build Gantt-chart-like experiences. It’s intended to be used as a basis to build your own experiences. You can render Gantt diagrams, time-based charts, etc. Components can be placed in various context – for example as table columns/cells.',
    },
];
