import { ModuleItem } from './DndModule';
import { SectionItem } from './DndSection';
import { getOrderBetween } from '@epam/uui';

const demoText = 'So you have your new digital camera and clicking away to glory anything and\n' +
    ' everything in sight. Now you want to print them and you need the best photo printers to\n' +
    ' print your fantastic photos. Let us talk about the various printers in the market and some\n' +
    ' tips on choosing the best photo printers. Most of the printers could easily be purchased\n' +
    ' under $500. While all of them have similar features, it is better to be aware of certain\n' +
    ' key features that determines their price and print quality. First to look out for is the\n' +
    ' printing width. It differs among printers. Normally they are available with a width of\n' +
    ' either 8.5 inches or 13 inches. A 6 color printer is adequate but if you want good black\n' +
    ' and white images as well it is better to go for 8-color printer.';

const defaultModuleItems: ModuleItem[] = [
    {
        id: 1,
        name: 'Module 1',
        tasks: { complete: 5, schedule: 5 },
        isCompleted: true,
        isDeleted: false,
        kind: 'module',
    },
    {
        id: 2,
        name: 'Module 2',
        tasks: { complete: 5, schedule: 5 },
        isCompleted: true,
        isDeleted: false,
        kind: 'module',
    },
    {
        id: 3,
        name: 'Module 3',
        tasks: { complete: 2, schedule: 5 },
        isCompleted: false,
        isDeleted: false,
        kind: 'module',
    },
    {
        id: 4,
        name: 'Module 4',
        tasks: { complete: 5, schedule: 5 },
        isCompleted: true,
        isDeleted: false,
        kind: 'module',
    },
    {
        id: 5,
        name: 'Module 5',
        tasks: { complete: 0, schedule: 3 },
        isCompleted: false,
        isDeleted: false,
        kind: 'module',
    },
];

const defaultSectionItems: SectionItem[] = [
    {
        id: 1,
        title: 'Section #1',
        deadline: 'October 25, 2020',
        status: 'Green',
        isFolded: true,
        kind: 'section',
        criteria: [
            {
                id: 11,
                sectionId: 1,
                kind: 'criterion',
                name: 'Criteria #1',
                isChecked: true,
            },
            {
                id: 12,
                sectionId: 1,
                kind: 'criterion',
                name: 'Criteria #2',
                isChecked: true,
            },
            {
                id: 13,
                sectionId: 1,
                kind: 'criterion',
                name: 'Criteria #3',
                isChecked: true,
            },
            {
                id: 14,
                sectionId: 1,
                kind: 'criterion',
                name: 'Criteria #4',
                isChecked: true,
            },
            {
                id: 15,
                sectionId: 1,
                kind: 'criterion',
                name: 'Criteria #5',
                isChecked: true,
            },
        ],
        materials: [
            {
                id: 111,
                sectionId: 1,
                kind: 'material',
                name: 'File_Name_1_1.suffix',
                description: 'Additional information',
            },
            {
                id: 112,
                sectionId: 1,
                kind: 'material',
                name: 'File_Name_1_2.suffix',
                description: 'Additional information',
            },
            {
                id: 113,
                sectionId: 1,
                kind: 'material',
                name: 'File_Name_1_3.suffix',
                description: 'Additional information',
            },
        ],
    },
    {
        id: 2,
        title: 'Section #2',
        deadline: 'October 29, 2020',
        status: 'Green',
        isFolded: false,
        kind: 'section',
        criteria: [
            {
                id: 21,
                sectionId: 2,
                kind: 'criterion',
                name: 'Criteria #1',
                isChecked: true,
            },
            {
                id: 22,
                sectionId: 2,
                kind: 'criterion',
                name: 'Criteria #2',
                isChecked: true,
            },
            {
                id: 23,
                sectionId: 2,
                kind: 'criterion',
                name: 'Criteria #3',
                isChecked: true,
            },
            {
                id: 24,
                sectionId: 2,
                kind: 'criterion',
                name: 'Criteria #4',
                isChecked: true,
            },
            {
                id: 25,
                sectionId: 2,
                kind: 'criterion',
                name: 'Criteria #5',
                isChecked: true,
            },
        ],
        materials: [
            {
                id: 211,
                sectionId: 2,
                kind: 'material',
                name: 'File_Name_2_1.suffix',
                description: 'Additional information',
            },
            {
                id: 212,
                sectionId: 2,
                kind: 'material',
                name: 'File_Name_2_2.suffix',
                description: 'Additional information',
            },
            {
                id: 213,
                sectionId: 2,
                kind: 'material',
                name: 'File_Name_2_3.suffix',
                description: 'Additional information',
            },
        ],
    },
    {
        id: 3,
        title: 'Section #3',
        deadline: 'November 5, 2020',
        status: 'Amber',
        isFolded: false,
        kind: 'section',
        criteria: [
            {
                id: 31,
                sectionId: 3,
                kind: 'criterion',
                name: 'Criteria #1',
                isChecked: false,
            },
            {
                id: 32,
                sectionId: 3,
                kind: 'criterion',
                name: 'Criteria #2',
                isChecked: false,
            },
            {
                id: 33,
                sectionId: 3,
                kind: 'criterion',
                name: 'Criteria #3',
                isChecked: false,
            },
        ],
        materials: [
            {
                id: 311,
                sectionId: 3,
                kind: 'material',
                name: 'File_Name_3_1.suffix',
                description: 'Additional information',
            },
            {
                id: 312,
                sectionId: 3,
                kind: 'material',
                name: 'File_Name_3_2.suffix',
                description: 'Additional information',
            },
            {
                id: 313,
                sectionId: 3,
                kind: 'material',
                name: 'File_Name_3_3.suffix',
                description: 'Additional information',
            },
        ],
    },
    {
        id: 4,
        title: 'Section #4',
        deadline: 'November 12, 2020',
        status: 'Amber',
        isFolded: false,
        kind: 'section',
        criteria: [
            {
                id: 41,
                sectionId: 4,
                kind: 'criterion',
                name: 'Criteria #1',
                isChecked: false,
            },
            {
                id: 42,
                sectionId: 4,
                kind: 'criterion',
                name: 'Criteria #2',
                isChecked: false,
            },
            {
                id: 43,
                sectionId: 4,
                kind: 'criterion',
                name: 'Criteria #3',
                isChecked: false,
            },
        ],
        materials: [
            {
                id: 411,
                sectionId: 4,
                kind: 'material',
                name: 'File_Name_4_1.suffix',
                description: 'Additional information',
            },
            {
                id: 412,
                sectionId: 4,
                kind: 'material',
                name: 'File_Name_4_2.suffix',
                description: 'Additional information',
            },
            {
                id: 413,
                sectionId: 4,
                kind: 'material',
                name: 'File_Name_4_3.suffix',
                description: 'Additional information',
            },
        ],
    },
    {
        id: 5,
        title: 'Section #5',
        deadline: 'November 22, 2020',
        status: 'Amber',
        isFolded: false,
        kind: 'section',
        criteria: [
            {
                id: 51,
                sectionId: 5,
                kind: 'criterion',
                name: 'Criteria #1',
                isChecked: false,
            },
            {
                id: 52,
                sectionId: 5,
                kind: 'criterion',
                name: 'Criteria #2',
                isChecked: false,
            },
            {
                id: 53,
                sectionId: 5,
                kind: 'criterion',
                name: 'Criteria #3',
                isChecked: false,
            },
        ],
        materials: [
            {
                id: 511,
                sectionId: 5,
                kind: 'material',
                name: 'File_Name_5_1.suffix',
                description: 'Additional information',
            },
            {
                id: 512,
                sectionId: 5,
                kind: 'material',
                name: 'File_Name_5_2.suffix',
                description: 'Additional information',
            },
            {
                id: 513,
                sectionId: 5,
                kind: 'material',
                name: 'File_Name_5_3.suffix',
                description: 'Additional information',
            },
        ],
    },
];

const getDefaultOrderConfig = <TItem, TId>(items: any[], initialOrder: string = 'a'): [any[], string] => {
    let config: any[] = [];
    let prevOrder = initialOrder;

    items.forEach((item, index) => {
        let order = getOrderBetween(prevOrder, null);
        config[index] = { ...item };
        config[index].order = prevOrder;
        prevOrder = order;
        if (config[index].materials) {
            const [materialsConfig, order] = getDefaultOrderConfig(config[index].materials, prevOrder);
            config[index].materials = materialsConfig;
            prevOrder = order;
        }
        if (config[index].criteria) {
            const [criteriaConfig, order] = getDefaultOrderConfig(config[index].criteria, prevOrder);
            config[index].criteria = criteriaConfig;
            prevOrder = order;
        }
    });

    return [config, prevOrder];
};

const [defaultConfigModuleItems] = getDefaultOrderConfig(defaultModuleItems);
const [defaultConfigSectionItems] = getDefaultOrderConfig(defaultSectionItems);

export { defaultConfigModuleItems, defaultConfigSectionItems, demoText };