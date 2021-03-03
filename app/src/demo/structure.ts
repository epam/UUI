import { DemoForm } from './form';
import { DemoDnd } from './dnd';
import { TimelineDemo } from './timeline/TimelineDemo';
import { DemoTable } from "./table";

export interface DemoItem {
    id: string;
    name: string;
    component?: any;
    source: string;
}

export const demoItems: DemoItem[] = [
    { id: 'dnd', name: 'Drag & Drop', component: DemoDnd, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/dnd' },
    { id: 'form', name: 'Form', component: DemoForm, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/form' },
    { id: 'table', name: 'Table', component: DemoTable, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/table' },
    { id: 'timeline', name: 'Timeline', component: TimelineDemo, source: 'https://github.com/epam/UUI/tree/main/app/src/demo/timeline' },
];