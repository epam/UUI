import { DemoForm } from './form';
import { DemoDnd } from './dnd';
import { TimelineDemo } from './timeline/TimelineDemo';
import { MasterDetailedTable } from "./tables/masterDetailedTable";
import { FilteredTable } from "./tables/filteredTable";
import { RichTextEditorDemo } from "./RTE/RichTextEditorDemo";

export interface DemoItem {
    id: string;
    name: string;
    component?: any;
    source: string;
    previewImage: string;
}

export const demoItems: DemoItem[] = [
    { id: 'dnd', name: 'Drag & Drop', component: DemoDnd, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/dnd', previewImage: '/static/images/DemoDnD.png' },
    { id: 'form', name: 'Form', component: DemoForm, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/form', previewImage: '/static/images/DemoForms.png' },
    { id: 'table', name: 'Table', component: MasterDetailedTable, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/tables/masterDetailedTable', previewImage: '/static/images/DemoTable.png' },
    { id: 'filteredTable', name: 'Filtered Table', component: FilteredTable, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/tables/filteredTable', previewImage: '/static/images/DemoTable.png' },
    { id: 'RTE', name: 'Rich Text Editor', component: RichTextEditorDemo, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/RTE', previewImage: '/static/images/DemoRTE.png' },
    { id: 'timeline', name: 'Timeline', component: TimelineDemo, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/timeline', previewImage: '/static/images/DemoTimeline.png' },
];