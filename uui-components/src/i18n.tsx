export const i18n = {
    mainMenu: {
        moreButtonCaption: 'More',
    },
    datePicker: {
        locale: 'en',
        localeUpdate: { weekStart: 1 },
    } as { locale?: string; localeUpdate?: Record<string, unknown> },
    pickerList: {
        rowsSelected: (rows: number) => ` (${rows} selected)`,
        showAll: 'SHOW ALL',
    },
    pickerToggler: {
        collapsedItemsTagName: (length: number) => `${length} selected`,
    },
    pickerInput: {
        defaultPlaceholder: (entity: string) => `Please select ${entity}`,
    },
    labeledInput: {
        optionalFieldLabel: 'This field is optional',
    },
    numericInput: {
        locale: undefined as string,
    },
};
