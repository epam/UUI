export const i18n = {
    mainMenu: {
        moreButtonCaption: 'More',
    },
    datePicker: {
        locale: 'en',
    },
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
