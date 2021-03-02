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
    { id: 'form', name: 'Form', component: DemoForm, source: 'https://git.epam.com/epm-tmc/ui/-/tree/develop/app/src/demo/form' },
    { id: 'dnd', name: 'Drag & Drop', component: DemoDnd, source: 'https://git.epam.com/epm-tmc/ui/-/tree/develop/app/src/demo/dnd' },
    { id: 'timeline', name: 'Timeline', component: TimelineDemo, source: 'https://git.epam.com/epm-tmc/ui/-/tree/develop/app/src/demo/timeline' },
    { id: 'table', name: 'Table', component: DemoTable, source: 'https://git.epam.com/epm-tmc/ui/-/tree/develop/app/src/demo/demoTable' },
];